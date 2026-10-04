from datetime import datetime
from flask import Blueprint, request, jsonify, g
from app.extensions import db
from app.security.decorators import roles_required
from app.security.argon2_hasher import hash_password, validate_password_strength
from app.security.audit import log_audit
from app.models.institution import Institution, Department, AcademicYear
from app.models.user import User, Role, UserRole
from app.models.privacy import AuditLog
from app.services.auth_service import AuthService

superadmin_bp = Blueprint('superadmin', __name__, url_prefix='/api/superadmin')

@superadmin_bp.route('/departments', methods=['GET'])
@roles_required('super_admin')
def list_departments():
    """List all departments in the institution."""
    departments = Department.query.all()
    return jsonify({
        'status': 'success',
        'data': [d.to_dict() for d in departments]
    })

@superadmin_bp.route('/departments', methods=['POST'])
@roles_required('super_admin')
def create_department():
    """Super Admin creates a new department."""
    data = request.get_json() or {}
    name = data.get('name', '').strip()
    code = data.get('code', '').strip().upper()
    dept_type = data.get('type', 'academic') # 'academic', 'exam', 'placement', 'administrative'
    description = data.get('description', '')

    if not name or not code:
        return jsonify({'status': 'error', 'message': 'Department name and code are required.'}), 400

    inst = Institution.query.first()
    if not inst:
        return jsonify({'status': 'error', 'message': 'Institution not initialized.'}), 400

    # Check for duplicate code
    existing = Department.query.filter_by(institution_id=inst.id, code=code).first()
    if existing:
        return jsonify({'status': 'error', 'message': f'Department code {code} already exists.'}), 400

    dept = Department(
        institution_id=inst.id,
        name=name,
        code=code,
        type=dept_type,
        description=description
    )
    db.session.add(dept)
    db.session.commit()

    log_audit(
        action='CREATE_DEPARTMENT',
        resource_type='department',
        resource_id=str(dept.id),
        department_id=dept.id,
        details={'name': dept.name, 'code': dept.code, 'type': dept.type}
    )

    return jsonify({
        'status': 'success',
        'message': f'Department "{dept.name}" created successfully.',
        'data': dept.to_dict()
    }), 201

@superadmin_bp.route('/department-admins', methods=['GET'])
@roles_required('super_admin')
def list_department_admins():
    """List all department administrators."""
    admin_roles = Role.query.filter(Role.name.in_(['academic_admin', 'exam_admin', 'placement_admin'])).all()
    role_ids = [r.id for r in admin_roles]

    user_roles = UserRole.query.filter(UserRole.role_id.in_(role_ids)).all()
    admins_data = []
    for ur in user_roles:
        u = ur.user
        admins_data.append({
            'user_id': u.id,
            'full_name': u.full_name,
            'email': u.email,
            'account_status': u.account_status,
            'role_name': ur.role.name,
            'role_display': ur.role.display_name,
            'department_id': ur.department_id,
            'department_name': ur.department.name if ur.department else None,
            'created_at': u.created_at.isoformat() if u.created_at else None
        })

    return jsonify({
        'status': 'success',
        'data': admins_data
    })

@superadmin_bp.route('/department-admins', methods=['POST'])
@roles_required('super_admin')
def create_department_admin():
    """
    Super Admin provisions a new Department Admin:
    - Sets initial temporary password
    - Assigns role ('academic_admin', 'exam_admin', 'placement_admin')
    - Associates with specific Department
    - Dispatches verification email
    """
    data = request.get_json() or {}
    email = data.get('email', '').strip().lower()
    full_name = data.get('full_name', '').strip()
    role_name = data.get('role_name', '').strip() # 'academic_admin', 'exam_admin', 'placement_admin'
    department_id = data.get('department_id')
    temp_password = data.get('password', 'Admin@2026Secure')

    if not email or not full_name or not role_name:
        return jsonify({'status': 'error', 'message': 'Email, full name, and role are required.'}), 400

    if role_name not in ['academic_admin', 'exam_admin', 'placement_admin']:
        return jsonify({'status': 'error', 'message': 'Invalid department admin role.'}), 400

    # Role assignment constraints: academic_admin must have an academic department
    if role_name == 'academic_admin' and not department_id:
        return jsonify({'status': 'error', 'message': 'Academic Department Admin must be assigned to a specific department.'}), 400

    # Check department existence if provided
    if department_id:
        dept = Department.query.get(department_id)
        if not dept:
            return jsonify({'status': 'error', 'message': 'Specified department not found.'}), 404

    # Check user existence
    if User.query.filter_by(email=email).first():
        return jsonify({'status': 'error', 'message': 'A user with this institutional email already exists.'}), 400

    # Validate password
    valid, msg = validate_password_strength(temp_password)
    if not valid:
        return jsonify({'status': 'error', 'message': msg}), 400

    inst = Institution.query.first()
    role = Role.query.filter_by(name=role_name).first()

    new_user = User(
        institution_id=inst.id,
        email=email,
        password_hash=hash_password(temp_password),
        full_name=full_name,
        account_status='pending_verification',
        phone_masked="+91 98****5500"
    )
    db.session.add(new_user)
    db.session.commit()

    ur = UserRole(user_id=new_user.id, role_id=role.id, department_id=department_id)
    db.session.add(ur)
    db.session.commit()

    # Send verification email
    delivery_result = AuthService.send_verification_email(new_user)

    log_audit(
        action='PROVISION_DEPARTMENT_ADMIN',
        resource_type='user',
        resource_id=str(new_user.id),
        department_id=department_id,
        details={'email': email, 'role': role_name, 'department_id': department_id}
    )

    return jsonify({
        'status': 'success',
        'message': f'Department Admin {full_name} provisioned. Verification email dispatched.',
        'data': new_user.to_dict(),
        'email_delivery': delivery_result
    }), 201

@superadmin_bp.route('/academic-years', methods=['GET', 'POST'])
@roles_required('super_admin')
def manage_academic_years():
    """List or create academic years."""
    if request.method == 'GET':
        years = AcademicYear.query.order_by(AcademicYear.start_date.desc()).all()
        return jsonify({
            'status': 'success',
            'data': [y.to_dict() for y in years]
        })

    data = request.get_json() or {}
    year_name = data.get('year_name', '').strip() # e.g. "2026-2027"
    start_date_str = data.get('start_date')
    end_date_str = data.get('end_date')
    is_current = data.get('is_current', False)

    if not year_name or not start_date_str or not end_date_str:
        return jsonify({'status': 'error', 'message': 'Year name, start date, and end date are required.'}), 400

    inst = Institution.query.first()
    start_date = datetime.strptime(start_date_str, '%Y-%m-%d').date()
    end_date = datetime.strptime(end_date_str, '%Y-%m-%d').date()

    if is_current:
        # Mark other years as not current
        AcademicYear.query.update({'is_current': False})

    year = AcademicYear(
        institution_id=inst.id,
        year_name=year_name,
        start_date=start_date,
        end_date=end_date,
        is_current=is_current
    )
    db.session.add(year)
    db.session.commit()

    log_audit(action='CREATE_ACADEMIC_YEAR', resource_type='academic_year', resource_id=str(year.id), details={'year_name': year_name})

    return jsonify({
        'status': 'success',
        'message': f'Academic Year {year_name} created.',
        'data': year.to_dict()
    }), 201

@superadmin_bp.route('/audit-overview', methods=['GET'])
@roles_required('super_admin')
def get_institutional_audit():
    """Retrieve institutional audit logs."""
    limit = min(int(request.args.get('limit', 100)), 500)
    action_filter = request.args.get('action')

    query = AuditLog.query.order_by(AuditLog.timestamp.desc())
    if action_filter:
        query = query.filter(AuditLog.action.ilike(f"%{action_filter}%"))

    logs = query.limit(limit).all()
    return jsonify({
        'status': 'success',
        'data': [log.to_dict() for log in logs]
    })

@superadmin_bp.route('/institution', methods=['GET', 'PUT'])
@roles_required('super_admin')
def manage_institution_settings():
    """Get or update institutional configuration."""
    inst = Institution.query.first()
    if not inst:
        return jsonify({'status': 'error', 'message': 'Institution not found.'}), 404

    if request.method == 'GET':
        return jsonify({'status': 'success', 'data': inst.to_dict()})

    data = request.get_json() or {}
    if 'name' in data:
        inst.name = data['name']
    if 'address' in data:
        inst.address = data['address']
    if 'contact_email' in data:
        inst.contact_email = data['contact_email']
    if 'settings' in data:
        inst.settings = data['settings']

    db.session.commit()
    log_audit(action='UPDATE_INSTITUTION_SETTINGS', resource_type='institution', resource_id=str(inst.id))

    return jsonify({'status': 'success', 'message': 'Institution settings updated.', 'data': inst.to_dict()})
