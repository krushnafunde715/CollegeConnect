from flask import Blueprint, request, jsonify, g, current_app
from app.services.auth_service import AuthService
from app.services.email_service import EmailDeliveryService
from app.security.decorators import token_required
from app.models.user import User, Role, UserRole
from app.models.institution import Institution
from app.extensions import limiter

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@auth_bp.route('/status', methods=['GET'])
def get_auth_status():
    """Returns the system initialization status and institutional domain."""
    super_admin_role = Role.query.filter_by(name='super_admin').first()
    has_super_admin = False
    if super_admin_role:
        has_super_admin = UserRole.query.filter_by(role_id=super_admin_role.id).first() is not None

    inst = Institution.query.first()
    return jsonify({
        'status': 'success',
        'data': {
            'is_initialized': has_super_admin,
            'institution_name': inst.name if inst else current_app.config.get('INSTITUTION_NAME'),
            'institution_code': inst.code if inst else current_app.config.get('INSTITUTION_CODE'),
            'institution_domain': inst.domain if inst else current_app.config.get('INSTITUTION_DOMAIN'),
            'dev_capture_enabled': current_app.config.get('DEV_EMAIL_CAPTURE_ENABLED', False)
        }
    })

@auth_bp.route('/init-superadmin', methods=['POST'])
def init_superadmin():
    """Initial setup endpoint for Super Admin account."""
    data = request.get_json() or {}
    email = data.get('email', '')
    password = data.get('password', '')
    full_name = data.get('full_name', '')
    setup_token = data.get('setup_token', '')

    if not email or not password or not full_name or not setup_token:
        return jsonify({
            'status': 'error',
            'message': 'Institutional email, password, full name, and setup token are required.',
            'code': 'MISSING_FIELDS'
        }), 400

    success, message, user = AuthService.initialize_super_admin(
        email=email,
        password=password,
        full_name=full_name,
        setup_token=setup_token,
        institution_name=data.get('institution_name'),
        institution_code=data.get('institution_code'),
        institution_domain=data.get('institution_domain')
    )

    if not success:
        return jsonify({'status': 'error', 'message': message, 'code': 'INIT_FAILED'}), 400

    return jsonify({
        'status': 'success',
        'message': message,
        'data': user.to_dict()
    }), 201

@auth_bp.route('/login', methods=['POST'])
@limiter.limit("15 per minute")
def login():
    """Shared login endpoint for all roles using registered institutional email + password."""
    data = request.get_json() or {}
    email = data.get('email', '')
    password = data.get('password', '')

    if not email or not password:
        return jsonify({
            'status': 'error',
            'message': 'Institutional email and password are required.',
            'code': 'MISSING_CREDENTIALS'
        }), 400

    success, message, token_or_code, user = AuthService.authenticate_user(
        email=email,
        password=password,
        ip_address=request.remote_addr,
        user_agent=request.user_agent.string if request.user_agent else ""
    )

    if not success:
        if token_or_code == 'PENDING_VERIFICATION':
            return jsonify({
                'status': 'error',
                'message': message,
                'code': 'PENDING_VERIFICATION',
                'email': email
            }), 403
        elif token_or_code == 'ACCOUNT_DISABLED':
            return jsonify({
                'status': 'error',
                'message': message,
                'code': 'ACCOUNT_DISABLED'
            }), 403
        return jsonify({
            'status': 'error',
            'message': message,
            'code': 'INVALID_CREDENTIALS'
        }), 401

    token = token_or_code
    response_data = {
        'status': 'success',
        'message': 'Authentication successful.',
        'data': {
            'token': token,
            'user': user.to_dict(),
            'role': user.get_primary_role(),
            'department_id': user.get_department_id()
        }
    }

    # Set secure HTTP-only cookie if configured
    response = jsonify(response_data)
    response.set_cookie(
        'token',
        token,
        httponly=True,
        secure=current_app.config.get('ENV') == 'production',
        samesite='Lax',
        max_age=8 * 3600
    )
    return response, 200

@auth_bp.route('/me', methods=['GET'])
@token_required
def get_current_user():
    """Retrieve authenticated user's verified identity, roles, and permissions."""
    user = g.current_user
    user_dict = user.to_dict(include_sensitive=True)
    if user.student_profile:
        user_dict['student'] = user.student_profile.to_dict(include_pii=True)

    return jsonify({
        'status': 'success',
        'data': user_dict
    })

@auth_bp.route('/logout', methods=['POST'])
@token_required
def logout():
    """Securely log out and revoke current session."""
    session_id = g.jwt_payload.get('session_id') if hasattr(g, 'jwt_payload') else None
    AuthService.logout_user(session_id=session_id, user_id=g.current_user.id)

    response = jsonify({
        'status': 'success',
        'message': 'Logged out successfully.'
    })
    response.delete_cookie('token')
    return response, 200

@auth_bp.route('/verify-email', methods=['POST'])
def verify_email():
    """Validate verification token and activate account."""
    data = request.get_json() or {}
    token = data.get('token', '')

    if not token:
        return jsonify({'status': 'error', 'message': 'Verification token is required.', 'code': 'MISSING_TOKEN'}), 400

    success, message = AuthService.verify_email_token(token)
    if not success:
        return jsonify({'status': 'error', 'message': message, 'code': 'VERIFICATION_FAILED'}), 400

    return jsonify({'status': 'success', 'message': message})

@auth_bp.route('/resend-verification', methods=['POST'])
def resend_verification():
    """Resend verification email to registered address."""
    data = request.get_json() or {}
    email = data.get('email', '').strip().lower()

    if not email:
        return jsonify({'status': 'error', 'message': 'Institutional email is required.'}), 400

    user = User.query.filter_by(email=email).first()
    if user and user.account_status == 'pending_verification':
        AuthService.send_verification_email(user)

    # Return generic response to avoid enumeration
    return jsonify({
        'status': 'success',
        'message': 'If an unverified institutional account exists for this email, a new verification link has been dispatched.'
    })

@auth_bp.route('/forgot-password', methods=['POST'])
@limiter.limit("5 per minute")
def forgot_password():
    """Initiate secure password reset."""
    data = request.get_json() or {}
    email = data.get('email', '')

    if not email:
        return jsonify({'status': 'error', 'message': 'Institutional email is required.', 'code': 'MISSING_EMAIL'}), 400

    success, message, delivery = AuthService.initiate_forgot_password(email)
    return jsonify({
        'status': 'success',
        'message': message,
        'dev_mode': current_app.config.get('DEV_EMAIL_CAPTURE_ENABLED', False)
    })

@auth_bp.route('/reset-password', methods=['POST'])
def reset_password():
    """Complete password reset with token and new password."""
    data = request.get_json() or {}
    token = data.get('token', '')
    new_password = data.get('new_password', '')

    if not token or not new_password:
        return jsonify({'status': 'error', 'message': 'Token and new password are required.', 'code': 'MISSING_FIELDS'}), 400

    success, message = AuthService.complete_password_reset(token, new_password)
    if not success:
        return jsonify({'status': 'error', 'message': message, 'code': 'RESET_FAILED'}), 400

    return jsonify({'status': 'success', 'message': message})

@auth_bp.route('/dev/outbox', methods=['GET'])
def get_dev_outbox():
    """Development helper endpoint to view captured emails and tokens during local testing."""
    if not current_app.config.get('DEV_EMAIL_CAPTURE_ENABLED', False) or current_app.config.get('ENV') == 'production':
        return jsonify({'status': 'error', 'message': 'Dev outbox is disabled in production.'}), 403

    outbox = EmailDeliveryService.get_dev_outbox()
    return jsonify({
        'status': 'success',
        'count': len(outbox),
        'data': outbox
    })
