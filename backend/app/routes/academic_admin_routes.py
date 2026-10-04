from datetime import datetime
from flask import Blueprint, request, jsonify, g
from app.extensions import db
from app.security.decorators import roles_required, department_scoped
from app.security.argon2_hasher import hash_password, validate_password_strength
from app.security.audit import log_audit
from app.models.institution import Department, AcademicYear, ClassRoom
from app.models.user import User, Role, UserRole
from app.models.academic import Student, Enrollment, TeacherAssignment, AcademicRecord
from app.models.privacy import CorrectionRequest, AuditLog
from app.services.auth_service import AuthService

academic_admin_bp = Blueprint('academic_admin', __name__, url_prefix='/api/academic-admin')

@academic_admin_bp.route('/classes', methods=['GET'])
@roles_required('academic_admin')
def list_department_classes():
    """List all classes strictly within the admin's assigned department."""
    dept_id = g.current_user.get_department_id()
    classes = ClassRoom.query.filter_by(department_id=dept_id).all()
    return jsonify({
        'status': 'success',
        'data': [c.to_dict() for c in classes]
    })

@academic_admin_bp.route('/classes', methods=['POST'])
@roles_required('academic_admin')
def create_class():
    """Create a new class within the assigned department (e.g., SE A, TE B)."""
    dept_id = g.current_user.get_department_id()
    data = request.get_json() or {}
    name = data.get('name', '').strip() # e.g. "SE A"
    year_level = data.get('year_level', '').strip().upper() # "FE", "SE", "TE", "BE"
    division = data.get('division', '').strip().upper() # "A", "B", "C"
    academic_year_id = data.get('academic_year_id')
    capacity = int(data.get('capacity', 70))

    if not name or not year_level or not division:
        return jsonify({'status': 'error', 'message': 'Class name, year level, and division are required.'}), 400

    # Auto-resolve current academic year if not provided
    if not academic_year_id:
        current_year = AcademicYear.query.filter_by(is_current=True).first() or AcademicYear.query.first()
        if not current_year:
            return jsonify({'status': 'error', 'message': 'No academic year configured in system.'}), 400
        academic_year_id = current_year.id

    # Check for duplicates in department and academic year
    existing = ClassRoom.query.filter_by(department_id=dept_id, academic_year_id=academic_year_id, name=name).first()
    if existing:
        return jsonify({'status': 'error', 'message': f'Class {name} already exists in this department.'}), 400

    classroom = ClassRoom(
        department_id=dept_id,
        academic_year_id=academic_year_id,
        name=name,
        year_level=year_level,
        division=division,
        capacity=capacity
    )
    db.session.add(classroom)
    db.session.commit()

    log_audit(
        action='CREATE_CLASS',
        resource_type='class',
        resource_id=str(classroom.id),
        department_id=dept_id,
        details={'name': name, 'year_level': year_level, 'division': division}
    )

    return jsonify({
        'status': 'success',
        'message': f'Class {classroom.name} created successfully.',
        'data': classroom.to_dict()
    }), 201

@academic_admin_bp.route('/students', methods=['GET'])
@roles_required('academic_admin')
def list_department_students():
    """List all students belonging to the admin's department."""
    dept_id = g.current_user.get_department_id()
    class_id = request.args.get('class_id')

    query = Student.query.filter_by(department_id=dept_id)
    if class_id:
        query = query.filter_by(current_class_id=int(class_id))

    students = query.all()
    return jsonify({
        'status': 'success',
        'data': [s.to_dict(include_pii=True) for s in students]
    })

@academic_admin_bp.route('/students', methods=['POST'])
@roles_required('academic_admin')
def add_student():
    """
    Academic Department Admin adds a new student:
    - Registered institutional email
    - College ID / PRN as separate student identifier (not login)
    - Assigned department and class enrollment
    - Dispatches verification email
    - Starts in 'pending_verification' status
    """
    dept_id = g.current_user.get_department_id()
    data = request.get_json() or {}
    email = data.get('email', '').strip().lower()
    full_name = data.get('full_name', '').strip()
    college_id = data.get('college_id', '').strip()
    class_id = data.get('class_id')
    admission_year = int(data.get('admission_year', datetime.utcnow().year))
    temp_password = data.get('password', 'Student@2026Secure')
    dob_str = data.get('date_of_birth')
    guardian_contact = data.get('guardian_contact')
    address = data.get('address')
    blood_group = data.get('blood_group', 'O+')

    if not email or not full_name or not college_id or not class_id:
        return jsonify({'status': 'error', 'message': 'Email, full name, College ID, and class are required.'}), 400

    # Ensure class belongs to this department
    classroom = ClassRoom.query.filter_by(id=class_id, department_id=dept_id).first()
    if not classroom:
        return jsonify({'status': 'error', 'message': 'Selected class does not belong to your department.'}), 403

    # Check for existing email or college_id
    if User.query.filter_by(email=email).first():
        return jsonify({'status': 'error', 'message': 'A user with this institutional email already exists.'}), 400

    if Student.query.filter_by(college_id=college_id).first():
        return jsonify({'status': 'error', 'message': 'A student with this College ID already exists.'}), 400

    valid, msg = validate_password_strength(temp_password)
    if not valid:
        return jsonify({'status': 'error', 'message': msg}), 400

    inst_id = g.current_user.institution_id
    student_role = Role.query.filter_by(name='student').first()

    # Create User account in pending_verification state
    user = User(
        institution_id=inst_id,
        email=email,
        password_hash=hash_password(temp_password),
        full_name=full_name,
        account_status='pending_verification',
        phone_masked="+91 98****" + college_id[-4:] if len(college_id) >= 4 else "+91 98****1234"
    )
    db.session.add(user)
    db.session.commit()

    ur = UserRole(user_id=user.id, role_id=student_role.id, department_id=dept_id)
    db.session.add(ur)

    dob = datetime.strptime(dob_str, '%Y-%m-%d').date() if dob_str else None

    # Create Student profile
    student = Student(
        user_id=user.id,
        college_id=college_id,
        department_id=dept_id,
        current_class_id=classroom.id,
        admission_year=admission_year,
        date_of_birth=dob,
        blood_group=blood_group,
        guardian_contact=guardian_contact,
        address=address,
        cgpa=float(data.get('cgpa', 8.2))
    )
    db.session.add(student)
    db.session.commit()

    # Create Enrollment record
    enrollment = Enrollment(
        student_id=student.id,
        class_id=classroom.id,
        academic_year_id=classroom.academic_year_id,
        enrollment_status='enrolled'
    )
    db.session.add(enrollment)
    db.session.commit()

    # Dispatch verification email
    delivery = AuthService.send_verification_email(user)

    log_audit(
        action='PROVISION_STUDENT',
        resource_type='student',
        resource_id=str(student.id),
        department_id=dept_id,
        details={'email': email, 'college_id': college_id, 'class_name': classroom.name}
    )

    return jsonify({
        'status': 'success',
        'message': f'Student {full_name} ({college_id}) created. Verification link sent.',
        'data': student.to_dict(include_pii=True),
        'email_delivery': delivery
    }), 201

@academic_admin_bp.route('/faculty', methods=['GET', 'POST'])
@roles_required('academic_admin')
def manage_faculty():
    """List or provision faculty / class teachers within the department."""
    dept_id = g.current_user.get_department_id()

    if request.method == 'GET':
        teacher_role = Role.query.filter_by(name='teacher').first()
        if not teacher_role:
            return jsonify({'status': 'success', 'data': []})

        user_roles = UserRole.query.filter_by(role_id=teacher_role.id, department_id=dept_id).all()
        teachers_data = []
        for ur in user_roles:
            u = ur.user
            assignments = [a.to_dict() for a in u.teacher_assignments if a.department_id == dept_id]
            teachers_data.append({
                'user_id': u.id,
                'full_name': u.full_name,
                'email': u.email,
                'account_status': u.account_status,
                'assignments': assignments,
                'is_class_teacher': any(a['is_class_teacher'] for a in assignments)
            })
        return jsonify({'status': 'success', 'data': teachers_data})

    # POST: Provision a new faculty member
    data = request.get_json() or {}
    email = data.get('email', '').strip().lower()
    full_name = data.get('full_name', '').strip()
    temp_password = data.get('password', 'Teacher@2026Secure')

    if not email or not full_name:
        return jsonify({'status': 'error', 'message': 'Email and full name are required.'}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({'status': 'error', 'message': 'User with this email already exists.'}), 400

    valid, msg = validate_password_strength(temp_password)
    if not valid:
        return jsonify({'status': 'error', 'message': msg}), 400

    teacher_role = Role.query.filter_by(name='teacher').first()
    user = User(
        institution_id=g.current_user.institution_id,
        email=email,
        password_hash=hash_password(temp_password),
        full_name=full_name,
        account_status='pending_verification',
        phone_masked="+91 97****8811"
    )
    db.session.add(user)
    db.session.commit()

    ur = UserRole(user_id=user.id, role_id=teacher_role.id, department_id=dept_id)
    db.session.add(ur)
    db.session.commit()

    delivery = AuthService.send_verification_email(user)

    log_audit(
        action='PROVISION_FACULTY',
        resource_type='user',
        resource_id=str(user.id),
        department_id=dept_id,
        details={'email': email, 'full_name': full_name}
    )

    return jsonify({
        'status': 'success',
        'message': f'Faculty member {full_name} created. Verification email sent.',
        'data': user.to_dict(),
        'email_delivery': delivery
    }), 201

@academic_admin_bp.route('/assign-teacher', methods=['POST'])
@roles_required('academic_admin')
def assign_teacher():
    """Assign a teacher to a class as Class Teacher or Subject Faculty."""
    dept_id = g.current_user.get_department_id()
    data = request.get_json() or {}
    user_id = data.get('user_id')
    class_id = data.get('class_id')
    subject_name = data.get('subject_name', '').strip()
    is_class_teacher = data.get('is_class_teacher', False)

    if not user_id or not class_id or not subject_name:
        return jsonify({'status': 'error', 'message': 'User ID, Class ID, and Subject Name are required.'}), 400

    # Ensure class belongs to department
    classroom = ClassRoom.query.filter_by(id=class_id, department_id=dept_id).first()
    if not classroom:
        return jsonify({'status': 'error', 'message': 'Class does not belong to your department.'}), 403

    # Ensure teacher belongs to department
    teacher_role = Role.query.filter_by(name='teacher').first()
    ur = UserRole.query.filter_by(user_id=user_id, role_id=teacher_role.id, department_id=dept_id).first()
    if not ur:
        return jsonify({'status': 'error', 'message': 'User is not a registered faculty member in your department.'}), 400

    # Check for existing assignment
    assignment = TeacherAssignment.query.filter_by(user_id=user_id, class_id=class_id, subject_name=subject_name).first()
    if not assignment:
        assignment = TeacherAssignment(
            user_id=user_id,
            department_id=dept_id,
            class_id=class_id,
            subject_name=subject_name,
            is_class_teacher=is_class_teacher
        )
        db.session.add(assignment)
    else:
        assignment.is_class_teacher = is_class_teacher

    db.session.commit()

    log_audit(
        action='ASSIGN_TEACHER',
        resource_type='teacher_assignment',
        resource_id=str(assignment.id),
        department_id=dept_id,
        details={'teacher_id': user_id, 'class_name': classroom.name, 'subject': subject_name, 'is_class_teacher': is_class_teacher}
    )

    return jsonify({
        'status': 'success',
        'message': f'Teacher assigned to {classroom.name} for {subject_name}.',
        'data': assignment.to_dict()
    }), 200

@academic_admin_bp.route('/corrections', methods=['GET'])
@roles_required('academic_admin')
def list_department_corrections():
    """List data correction requests from students within this department."""
    dept_id = g.current_user.get_department_id()
    requests = CorrectionRequest.query.join(Student).filter(Student.department_id == dept_id).order_by(CorrectionRequest.created_at.desc()).all()
    return jsonify({
        'status': 'success',
        'data': [r.to_dict() for r in requests]
    })

@academic_admin_bp.route('/corrections/<int:request_id>/review', methods=['POST'])
@roles_required('academic_admin')
def review_correction_request(request_id):
    """
    Review and approve/reject a student data correction request.
    If approved, automatically updates the target student field in the database!
    """
    dept_id = g.current_user.get_department_id()
    req = CorrectionRequest.query.get(request_id)
    if not req:
        return jsonify({'status': 'error', 'message': 'Correction request not found.'}), 404

    # Verify student belongs to this department
    if req.student.department_id != dept_id:
        return jsonify({'status': 'error', 'message': 'Unauthorized: Request belongs to another department.'}), 403

    data = request.get_json() or {}
    decision = data.get('decision') # 'approved' or 'rejected'
    notes = data.get('notes', '')

    if decision not in ['approved', 'rejected']:
        return jsonify({'status': 'error', 'message': 'Decision must be "approved" or "rejected".'}), 400

    req.status = decision
    req.reviewed_by_user_id = g.current_user.id
    req.review_notes = notes
    req.reviewed_at = datetime.utcnow()

    # If approved, perform automated update
    if decision == 'approved':
        student = req.student
        user = student.user
        field = req.field_name.lower()

        if field in ['full_name', 'name']:
            user.full_name = req.requested_value
        elif field in ['phone', 'phone_masked']:
            user.phone_masked = req.requested_value
        elif field in ['guardian_contact', 'emergency_contact']:
            student.guardian_contact = req.requested_value
        elif field in ['address']:
            student.address = req.requested_value
        elif field in ['blood_group']:
            student.blood_group = req.requested_value

    db.session.commit()

    log_audit(
        action=f'CORRECTION_REQUEST_{decision.upper()}',
        resource_type='correction_request',
        resource_id=str(req.id),
        department_id=dept_id,
        details={'field': req.field_name, 'decision': decision, 'student_id': req.student_id}
    )

    return jsonify({
        'status': 'success',
        'message': f'Correction request #{req.id} has been {decision}.',
        'data': req.to_dict()
    })

@academic_admin_bp.route('/department-reports', methods=['GET'])
@roles_required('academic_admin')
def get_department_reports():
    """Overview statistics for the department."""
    dept_id = g.current_user.get_department_id()
    dept = Department.query.get(dept_id)
    student_count = Student.query.filter_by(department_id=dept_id).count()
    class_count = ClassRoom.query.filter_by(department_id=dept_id).count()
    teacher_role = Role.query.filter_by(name='teacher').first()
    faculty_count = UserRole.query.filter_by(role_id=teacher_role.id, department_id=dept_id).count() if teacher_role else 0
    pending_corrections = CorrectionRequest.query.join(Student).filter(Student.department_id == dept_id, CorrectionRequest.status == 'pending').count()

    return jsonify({
        'status': 'success',
        'data': {
            'department_name': dept.name if dept else '',
            'department_code': dept.code if dept else '',
            'student_count': student_count,
            'class_count': class_count,
            'faculty_count': faculty_count,
            'pending_corrections': pending_corrections
        }
    })
