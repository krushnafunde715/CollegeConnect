import pytest
from datetime import datetime, date, timedelta
from app.extensions import db
from app.models.institution import Institution, Department, AcademicYear, ClassRoom
from app.models.user import User, Role, UserRole
from app.models.academic import Student, TeacherAssignment, Attendance, AcademicRecord, Enrollment
from app.models.examination import ExamSchedule, ExamRegistration, Result, HallTicket
from app.models.placement import Company, PlacementDrive, Application, Offer
from app.models.privacy import PrivacyNotice, ConsentRecord, PrivacyRequest, CorrectionRequest, AuditLog
from app.security.argon2_hasher import hash_password

@pytest.fixture
def setup_validation_data(app):
    """Provisions a complete ecosystem of users, classes, assignments, and records for testing."""
    inst = Institution.query.first()
    ay = AcademicYear.query.first()
    roles = {r.name: r for r in Role.query.all()}
    
    # 1. Departments
    comp_dept = Department.query.filter_by(code='COMP').first()
    exam_dept = Department(institution_id=inst.id, name='Examination Cell', code='EXAM', type='exam')
    placement_dept = Department(institution_id=inst.id, name='Training & Placement', code='TPO', type='placement')
    db.session.add_all([exam_dept, placement_dept])
    db.session.commit()

    # 2. Super Admin
    sa_user = User(
        institution_id=inst.id,
        email='superadmin@college.edu',
        password_hash=hash_password('SuperAdmin@2026!'),
        full_name='Kartik Bhegade',
        account_status='active',
        phone_masked='+91 99****0001'
    )
    db.session.add(sa_user)
    db.session.commit()
    db.session.add(UserRole(user_id=sa_user.id, role_id=roles['super_admin'].id, department_id=None))

    # 3. Academic Admin (Comp Eng)
    aa_user = User(
        institution_id=inst.id,
        email='comp.admin@college.edu',
        password_hash=hash_password('Admin@COMP2026!'),
        full_name='Prof. Kirti Borhade',
        account_status='active',
        phone_masked='+91 98****1101'
    )
    db.session.add(aa_user)
    db.session.commit()
    db.session.add(UserRole(user_id=aa_user.id, role_id=roles['academic_admin'].id, department_id=comp_dept.id))

    # 4. Exam Admin
    ea_user = User(
        institution_id=inst.id,
        email='exam.admin@college.edu',
        password_hash=hash_password('Admin@EXAM2026!'),
        full_name='Prof. Akash Mhetre',
        account_status='active',
        phone_masked='+91 98****1102'
    )
    db.session.add(ea_user)
    db.session.commit()
    db.session.add(UserRole(user_id=ea_user.id, role_id=roles['exam_admin'].id, department_id=exam_dept.id))

    # 5. Placement Admin
    pa_user = User(
        institution_id=inst.id,
        email='placement.admin@college.edu',
        password_hash=hash_password('Admin@TPO2026!'),
        full_name='Prof. Satyajit Sirsat',
        account_status='active',
        phone_masked='+91 98****1103'
    )
    db.session.add(pa_user)
    db.session.commit()
    db.session.add(UserRole(user_id=pa_user.id, role_id=roles['placement_admin'].id, department_id=placement_dept.id))

    # 6. Class Teacher
    ct_user = User(
        institution_id=inst.id,
        email='teacher.hayes@college.edu',
        password_hash=hash_password('Teacher@2026!'),
        full_name='Prof. Sonal Kadam',
        account_status='active',
        phone_masked='+91 97****5522'
    )
    db.session.add(ct_user)
    db.session.commit()
    db.session.add(UserRole(user_id=ct_user.id, role_id=roles['teacher'].id, department_id=comp_dept.id))

    # 7. Classes
    class_te_a = ClassRoom(department_id=comp_dept.id, academic_year_id=ay.id, name='TE A', year_level='TE', division='A', capacity=70)
    db.session.add(class_te_a)
    db.session.commit()

    # Teacher Assignment
    assignment = TeacherAssignment(
        user_id=ct_user.id,
        department_id=comp_dept.id,
        class_id=class_te_a.id,
        subject_name='Data Structures & Algorithms',
        is_class_teacher=True
    )
    db.session.add(assignment)
    db.session.commit()

    # 8. Student
    st_user = User(
        institution_id=inst.id,
        email='alice.sharma@college.edu',
        password_hash=hash_password('Student@2026!'),
        full_name='Krushna Funde',
        account_status='active',
        phone_masked='+91 98****0001'
    )
    db.session.add(st_user)
    db.session.commit()
    db.session.add(UserRole(user_id=st_user.id, role_id=roles['student'].id, department_id=comp_dept.id))

    student = Student(
        user_id=st_user.id,
        college_id='22CE001',
        department_id=comp_dept.id,
        current_class_id=class_te_a.id,
        admission_year=2023,
        date_of_birth=date(2004, 5, 15),
        blood_group='B+',
        guardian_name='Ashok Funde',
        guardian_contact='+91 98221 99881',
        address='Talegaon Dabhade, Pune 410506',
        cgpa=8.85
    )
    db.session.add(student)
    db.session.commit()

    db.session.add(Enrollment(
        student_id=student.id,
        class_id=class_te_a.id,
        academic_year_id=ay.id,
        enrollment_status='enrolled'
    ))
    db.session.commit()

    return {
        'inst': inst,
        'ay': ay,
        'comp_dept': comp_dept,
        'exam_dept': exam_dept,
        'placement_dept': placement_dept,
        'class_te_a': class_te_a,
        'student': student
    }

def get_auth_token(client, email, password):
    resp = client.post('/api/auth/login', json={'email': email, 'password': password})
    assert resp.status_code == 200, f"Login failed for {email}: {resp.get_json()}"
    data = resp.get_json()
    return data['data']['token'], data['data']['user']

# =========================================================================
# PHASE 1: APPLICATION STARTUP & INITIAL SETUP VERIFICATION
# =========================================================================
def test_system_initialization_and_metadata(client, setup_validation_data):
    """Verify system status, institutions, and core metadata."""
    resp = client.get('/api/auth/status')
    assert resp.status_code == 200
    data = resp.get_json()['data']
    assert data['is_initialized'] is True
    assert 'Test Institute of Technology' in data['institution_name']

def test_database_table_integrity_and_relationships(setup_validation_data):
    """Verify database foreign keys and table models."""
    inst = Institution.query.first()
    assert inst is not None
    assert len(inst.departments) >= 3
    assert len(inst.academic_years) >= 1

    comp_dept = Department.query.filter_by(code='COMP').first()
    assert comp_dept is not None
    assert comp_dept.institution_id == inst.id

    # Check classes
    classes = ClassRoom.query.filter_by(department_id=comp_dept.id).all()
    assert len(classes) >= 1

# =========================================================================
# PHASE 2: AUTHENTICATION & SESSION LIFECYCLE
# =========================================================================
def test_authentication_lifecycle_all_roles(client, setup_validation_data):
    """Test login with valid/invalid credentials, empty forms, and logout across roles."""
    # 1. Invalid email
    resp = client.post('/api/auth/login', json={'email': 'nonexistent@college.edu', 'password': 'Password@123'})
    assert resp.status_code == 401

    # 2. Invalid password
    resp = client.post('/api/auth/login', json={'email': 'superadmin@college.edu', 'password': 'WrongPassword123!'})
    assert resp.status_code == 401

    # 3. Empty form validation
    resp = client.post('/api/auth/login', json={'email': '', 'password': ''})
    assert resp.status_code == 400

    # 4. Successful login for all 6 roles
    roles_credentials = [
        ('superadmin@college.edu', 'SuperAdmin@2026!', 'super_admin'),
        ('comp.admin@college.edu', 'Admin@COMP2026!', 'academic_admin'),
        ('exam.admin@college.edu', 'Admin@EXAM2026!', 'exam_admin'),
        ('placement.admin@college.edu', 'Admin@TPO2026!', 'placement_admin'),
        ('teacher.hayes@college.edu', 'Teacher@2026!', 'teacher'),
        ('alice.sharma@college.edu', 'Student@2026!', 'student'),
    ]

    for email, password, expected_role in roles_credentials:
        token, user = get_auth_token(client, email, password)
        assert token is not None
        assert user['primary_role'] == expected_role

        # Verify /api/auth/me session check
        me_resp = client.get('/api/auth/me', headers={'Authorization': f'Bearer {token}'})
        assert me_resp.status_code == 200
        assert me_resp.get_json()['data']['email'] == email

        # Test logout session invalidation
        logout_resp = client.post('/api/auth/logout', headers={'Authorization': f'Bearer {token}'})
        assert logout_resp.status_code == 200

        # Subsequent request with invalidated token must be rejected
        revoked_resp = client.get('/api/auth/me', headers={'Authorization': f'Bearer {token}'})
        assert revoked_resp.status_code == 401

# =========================================================================
# PHASE 3: SUPER ADMIN MODULE OPERATIONS
# =========================================================================
def test_super_admin_endpoints(client, setup_validation_data):
    """Test super admin department, academic year, audit, and settings management."""
    token, user = get_auth_token(client, 'superadmin@college.edu', 'SuperAdmin@2026!')
    headers = {'Authorization': f'Bearer {token}'}

    # 1. List departments
    resp = client.get('/api/superadmin/departments', headers=headers)
    assert resp.status_code == 200
    assert len(resp.get_json()['data']) >= 3

    # 2. Create new department
    resp = client.post('/api/superadmin/departments', headers=headers, json={
        'name': 'Civil Engineering',
        'code': 'CIVIL',
        'type': 'academic',
        'description': 'Department of Civil Engineering'
    })
    assert resp.status_code == 201

    # 3. List department admins
    resp = client.get('/api/superadmin/department-admins', headers=headers)
    assert resp.status_code == 200

    # 4. View Audit Overview
    resp = client.get('/api/superadmin/audit-overview', headers=headers)
    assert resp.status_code == 200
    assert len(resp.get_json()['data']) > 0

    # 5. Manage Institution Settings
    resp = client.get('/api/superadmin/institution', headers=headers)
    assert resp.status_code == 200

# =========================================================================
# PHASE 4: ACADEMIC ADMIN MODULE OPERATIONS
# =========================================================================
def test_academic_admin_endpoints(client, setup_validation_data):
    """Test academic admin class creation, student enrollment, and faculty assignment."""
    token, user = get_auth_token(client, 'comp.admin@college.edu', 'Admin@COMP2026!')
    headers = {'Authorization': f'Bearer {token}'}

    # 1. Get department classes
    resp = client.get('/api/academic-admin/classes', headers=headers)
    assert resp.status_code == 200
    assert len(resp.get_json()['data']) >= 1

    # 2. Get department students
    resp = client.get('/api/academic-admin/students', headers=headers)
    assert resp.status_code == 200
    assert len(resp.get_json()['data']) >= 1

# =========================================================================
# PHASE 5: CLASS TEACHER MODULE OPERATIONS
# =========================================================================
def test_class_teacher_endpoints(client, setup_validation_data):
    """Test class teacher assigned classes, student list, and attendance."""
    token, user = get_auth_token(client, 'teacher.hayes@college.edu', 'Teacher@2026!')
    headers = {'Authorization': f'Bearer {token}'}

    # 1. Get assigned classes
    resp = client.get('/api/teacher/my-classes', headers=headers)
    assert resp.status_code == 200
    classes = resp.get_json()['data']
    assert len(classes) >= 1
    class_id = classes[0]['id']

    # 2. Get class students (masked PII for teacher)
    resp = client.get(f'/api/teacher/classes/{class_id}/students', headers=headers)
    assert resp.status_code == 200
    students = resp.get_json()['data']
    assert len(students) >= 1
    assert 'guardian_contact' in students[0]

    # 3. Post Attendance
    resp = client.post('/api/teacher/attendance', headers=headers, json={
        'class_id': class_id,
        'subject_name': 'Data Structures & Algorithms',
        'date': date.today().isoformat(),
        'attendance': [{'student_id': students[0]['id'], 'status': 'present'}]
    })
    assert resp.status_code == 200

# =========================================================================
# PHASE 6: EXAMINATION ADMIN MODULE OPERATIONS
# =========================================================================
def test_exam_admin_endpoints(client, setup_validation_data):
    """Test examination schedule creation, result publication, and hall ticket generation."""
    token, user = get_auth_token(client, 'exam.admin@college.edu', 'Admin@EXAM2026!')
    headers = {'Authorization': f'Bearer {token}'}

    # 1. List schedules
    resp = client.get('/api/exam/schedules', headers=headers)
    assert resp.status_code == 200

    # 2. Create schedule
    comp_dept = Department.query.filter_by(code='COMP').first()
    resp = client.post('/api/exam/schedules', headers=headers, json={
        'department_id': comp_dept.id,
        'exam_name': 'In-Sem Theory Examination 2026',
        'semester': 'V',
        'subject_code': 'COMP301',
        'subject_name': 'Data Structures',
        'exam_date': (date.today() + timedelta(days=14)).isoformat(),
        'start_time': '10:00 AM',
        'end_time': '12:00 PM',
        'total_marks': 50
    })
    assert resp.status_code == 201

# =========================================================================
# PHASE 7: PLACEMENT ADMIN MODULE OPERATIONS
# =========================================================================
def test_placement_admin_endpoints(client, setup_validation_data):
    """Test placement company management, drives, applications, and offers."""
    token, user = get_auth_token(client, 'placement.admin@college.edu', 'Admin@TPO2026!')
    headers = {'Authorization': f'Bearer {token}'}

    # 1. Manage companies
    resp = client.get('/api/placement/companies', headers=headers)
    assert resp.status_code == 200

    # 2. Create company
    resp = client.post('/api/placement/companies', headers=headers, json={
        'name': f'Infosys_{datetime.now().microsecond}',
        'industry': 'Information Technology',
        'website': 'https://infosys.com',
        'contact_email': 'recruiting@infosys.com',
        'description': 'Global Leader in IT Solutions'
    })
    assert resp.status_code == 201
    comp_id = resp.get_json()['data']['id']

    # 3. Create drive
    resp = client.post('/api/placement/drives', headers=headers, json={
        'company_id': comp_id,
        'title': 'Campus SDE Hiring 2026',
        'role_description': 'Software Engineer Trainee',
        'eligible_departments': 'COMP,IT',
        'min_cgpa': 7.0,
        'package_details': '9.5 LPA',
        'drive_date': (date.today() + timedelta(days=20)).isoformat(),
        'registration_deadline': (date.today() + timedelta(days=10)).isoformat(),
        'location': 'Placement Auditorium Block A'
    })
    assert resp.status_code == 201

# =========================================================================
# PHASE 8: STUDENT MODULE & PRIVACY/DPDP TESTING
# =========================================================================
def test_student_endpoints_and_privacy_rights(client, setup_validation_data):
    """Test student profile, academic records, attendance, privacy consents, and corrections."""
    token, user = get_auth_token(client, 'alice.sharma@college.edu', 'Student@2026!')
    headers = {'Authorization': f'Bearer {token}'}

    # 1. View Student Dashboard
    resp = client.get('/api/student/dashboard', headers=headers)
    assert resp.status_code == 200
    data = resp.get_json()['data']
    assert 'attendance_percentage' in data
    assert 'cgpa' in data

    # 2. View Student Profile (with PII)
    resp = client.get('/api/student/profile', headers=headers)
    assert resp.status_code == 200
    student_data = resp.get_json()['data']
    assert student_data['full_name'] == 'Krushna Funde'

    # 3. View Academic Records
    resp = client.get('/api/student/academic-records', headers=headers)
    assert resp.status_code == 200

    # 4. View Attendance
    resp = client.get('/api/student/attendance', headers=headers)
    assert resp.status_code == 200

    # 5. View Examinations
    resp = client.get('/api/student/examinations', headers=headers)
    assert resp.status_code == 200

    # 6. View Privacy Notices & Consents
    resp = client.get('/api/student/privacy/notices', headers=headers)
    assert resp.status_code == 200

    # 7. Submit Data Correction Request (DPDP Right to Correction)
    resp = client.post('/api/student/correction-requests', headers=headers, json={
        'field_name': 'phone_masked',
        'requested_value': '+91 98****9988',
        'justification': 'Updated personal mobile contact number.'
    })
    assert resp.status_code == 201

# =========================================================================
# PHASE 9: RBAC AND ACCESS CONTROL ISOLATION
# =========================================================================
def test_unauthorized_cross_role_access(client, setup_validation_data):
    """Verify that student cannot access admin routes and vice versa."""
    student_token, _ = get_auth_token(client, 'alice.sharma@college.edu', 'Student@2026!')
    student_headers = {'Authorization': f'Bearer {student_token}'}

    # Student accessing Super Admin
    resp = client.get('/api/superadmin/departments', headers=student_headers)
    assert resp.status_code == 403

    # Student accessing Academic Admin
    resp = client.get('/api/academic-admin/classes', headers=student_headers)
    assert resp.status_code == 403

    # Student accessing Placement Admin
    resp = client.post('/api/placement/companies', headers=student_headers, json={'name': 'HackCorp', 'industry': 'Tech'})
    assert resp.status_code == 403

    # Teacher accessing Super Admin
    teacher_token, _ = get_auth_token(client, 'teacher.hayes@college.edu', 'Teacher@2026!')
    teacher_headers = {'Authorization': f'Bearer {teacher_token}'}
    resp = client.get('/api/superadmin/departments', headers=teacher_headers)
    assert resp.status_code == 403
