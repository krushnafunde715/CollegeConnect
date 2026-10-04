from functools import wraps
from flask import request, jsonify, g
from app.extensions import db
from app.models.user import User, UserSession
from app.security.jwt_handler import decode_jwt
from app.security.audit import log_audit

def token_required(f):
    """Decorator to enforce valid JWT authentication on protected endpoints."""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None

        # Check Authorization header (Bearer <token>)
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            parts = auth_header.split()
            if len(parts) == 2 and parts[0].lower() == 'bearer':
                token = parts[1]

        # Check cookie fallback
        if not token and 'token' in request.cookies:
            token = request.cookies.get('token')

        if not token:
            return jsonify({
                'status': 'error',
                'message': 'Authentication token is required to access this resource.',
                'code': 'UNAUTHORIZED'
            }), 401

        try:
            payload = decode_jwt(token)
            raw_sub = payload.get('sub') or payload.get('user_id')
            user_id = int(raw_sub) if raw_sub is not None else None
            session_id = payload.get('session_id')

            user = db.session.get(User, user_id) if user_id else None
            if not user:
                return jsonify({
                    'status': 'error',
                    'message': 'User account not found.',
                    'code': 'USER_NOT_FOUND'
                }), 401

            # Check account status
            if user.account_status == 'pending_verification':
                return jsonify({
                    'status': 'error',
                    'message': 'Account is pending email verification. Please verify your institutional email.',
                    'code': 'ACCOUNT_PENDING_VERIFICATION'
                }), 403
            elif user.account_status in ['suspended', 'disabled']:
                return jsonify({
                    'status': 'error',
                    'message': f'Your account is {user.account_status}. Please contact your administrator.',
                    'code': 'ACCOUNT_INACTIVE'
                }), 403

            # Check session validity if session_id is recorded
            if session_id:
                session = db.session.get(UserSession, int(session_id))
                if not session or not session.is_active:
                    return jsonify({
                        'status': 'error',
                        'message': 'Session has been revoked or invalidated. Please log in again.',
                        'code': 'SESSION_EXPIRED'
                    }), 401

            g.current_user = user
            g.jwt_payload = payload

        except ValueError as e:
            return jsonify({
                'status': 'error',
                'message': str(e),
                'code': 'INVALID_TOKEN'
            }), 401
        except Exception as e:
            return jsonify({
                'status': 'error',
                'message': f'Authentication failed: {str(e)}',
                'code': 'AUTH_ERROR'
            }), 401

        return f(*args, **kwargs)

    return decorated


def roles_required(*allowed_roles):
    """Decorator to enforce role-based access control (RBAC)."""
    def decorator(f):
        @wraps(f)
        @token_required
        def decorated_function(*args, **kwargs):
            user = g.current_user
            user_role_names = [ur.role.name for ur in user.roles if ur.role]

            # Super admin has institutional role, but check if specifically permitted or if any allowed role matches
            has_permission = any(role in allowed_roles for role in user_role_names)

            if not has_permission:
                log_audit(
                    action='ACCESS_DENIED_RBAC',
                    resource_type='endpoint',
                    resource_id=request.path,
                    status='denied',
                    details={'attempted_roles': user_role_names, 'required_roles': list(allowed_roles)}
                )
                return jsonify({
                    'status': 'error',
                    'message': 'Access denied: You do not possess the required role permissions for this resource.',
                    'code': 'FORBIDDEN'
                }), 403

            return f(*args, **kwargs)
        return decorated_function
    return decorator


def department_scoped(f):
    """
    Decorator to enforce department-level data isolation.
    Ensures that Department Admins cannot view or modify resources outside their assigned department.
    """
    @wraps(f)
    def decorated(*args, **kwargs):
        user = g.current_user
        user_roles = [ur.role.name for ur in user.roles if ur.role]

        # If user is Super Admin, they have cross-department oversight for institutional config
        if 'super_admin' in user_roles:
            return f(*args, **kwargs)

        user_dept_id = user.get_department_id()
        if not user_dept_id:
            return jsonify({
                'status': 'error',
                'message': 'No department assigned to this administrative account.',
                'code': 'NO_DEPARTMENT_ASSIGNED'
            }), 403

        # Check department_id in route parameters if present
        route_dept_id = kwargs.get('department_id')
        if route_dept_id and int(route_dept_id) != user_dept_id:
            log_audit(
                action='CROSS_DEPARTMENT_ACCESS_BLOCKED',
                resource_type='department',
                resource_id=str(route_dept_id),
                department_id=user_dept_id,
                status='denied',
                details={'user_dept': user_dept_id, 'target_dept': route_dept_id}
            )
            return jsonify({
                'status': 'error',
                'message': 'Department Isolation Violation: You are not authorized to access resources of other departments.',
                'code': 'DEPARTMENT_ISOLATION_VIOLATION'
            }), 403

        return f(*args, **kwargs)
    return decorated


def student_ownership_required(f):
    """
    Decorator to ensure students can only view/modify their own personal records.
    Prevents IDOR (Insecure Direct Object References).
    """
    @wraps(f)
    def decorated(*args, **kwargs):
        user = g.current_user
        user_roles = [ur.role.name for ur in user.roles if ur.role]

        if 'student' in user_roles:
            student = user.student_profile
            if not student:
                return jsonify({
                    'status': 'error',
                    'message': 'Student profile not found for this user.',
                    'code': 'STUDENT_PROFILE_NOT_FOUND'
                }), 404

            # If student_id is passed in route kwargs, verify it matches
            target_student_id = kwargs.get('student_id')
            if target_student_id and int(target_student_id) != student.id:
                log_audit(
                    action='IDOR_ACCESS_BLOCKED',
                    resource_type='student',
                    resource_id=str(target_student_id),
                    status='denied',
                    details={'attempted_student_id': target_student_id, 'actual_student_id': student.id}
                )
                return jsonify({
                    'status': 'error',
                    'message': 'Privacy Protection: You can only access your own student data.',
                    'code': 'PRIVACY_VIOLATION'
                }), 403

        return f(*args, **kwargs)
    return decorated
