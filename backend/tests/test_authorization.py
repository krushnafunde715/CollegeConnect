from app.models.user import User, Role, UserRole
from app.models.institution import Institution, Department, AcademicYear, ClassRoom
from app.models.academic import Student, TeacherAssignment
from app.security.argon2_hasher import hash_password
from app.security.jwt_handler import generate_jwt
from app.extensions import db

def test_department_isolation_between_admins(client):
    """Ensure Computer Engineering Admin cannot access or modify Information Technology resources."""
    inst = Institution.query.first()
    ay = AcademicYear.query.first()
    comp_dept = Department.query.filter_by(code='COMP').first()
    it_dept = Department.query.filter_by(code='IT').first()
    acad_role = Role.query.filter_by(name='academic_admin').first()

    # Create COMP Admin
    comp_admin = User(
        institution_id=inst.id,
        email='comp.admin@college.edu',
        password_hash=hash_password('CompAdmin@2026!'),
        full_name='COMP Admin',
        account_status='active'
    )
    db.session.add(comp_admin)
    db.session.commit()
    db.session.add(UserRole(user_id=comp_admin.id, role_id=acad_role.id, department_id=comp_dept.id))
    db.session.commit()

    # Create IT Class
    it_class = ClassRoom(department_id=it_dept.id, academic_year_id=ay.id, name='IT SE A', year_level='SE', division='A')
    db.session.add(it_class)
    db.session.commit()

    # Authenticate as COMP Admin
    token = generate_jwt(user_id=comp_admin.id, email=comp_admin.email, role_name='academic_admin', department_id=comp_dept.id)

    # COMP Admin listing classes only returns COMP classes, not IT classes
    res = client.get('/api/academic-admin/classes', headers={'Authorization': f'Bearer {token}'})
    assert res.status_code == 200
    classes = res.get_json()['data']
    assert not any(c['department_id'] == it_dept.id for c in classes)

    # Attempt to create a student in an IT class using COMP Admin credentials -> Must be rejected (403)
    res_add = client.post('/api/academic-admin/students', json={
        'email': 'intruder.student@college.edu',
        'full_name': 'Intruder Student',
        'college_id': 'CC-IT-999',
        'class_id': it_class.id,
        'password': 'Student@2026!'
    }, headers={'Authorization': f'Bearer {token}'})

    assert res_add.status_code == 403
    assert 'does not belong to your department' in res_add.get_json()['message']

def test_teacher_class_access_control(client):
    """Ensure Teacher can only access students in assigned classes, and is blocked from unassigned classes."""
    inst = Institution.query.first()
    ay = AcademicYear.query.first()
    comp_dept = Department.query.filter_by(code='COMP').first()
    teacher_role = Role.query.filter_by(name='teacher').first()
    student_role = Role.query.filter_by(name='student').first()

    # Classes
    class_a = ClassRoom(department_id=comp_dept.id, academic_year_id=ay.id, name='SE A', year_level='SE', division='A')
    class_b = ClassRoom(department_id=comp_dept.id, academic_year_id=ay.id, name='SE B', year_level='SE', division='B')
    db.session.add_all([class_a, class_b])
    db.session.commit()

    # Teacher assigned to Class A only
    teacher = User(institution_id=inst.id, email='teacher.a@college.edu', password_hash=hash_password('Teacher@2026!'), full_name='Teacher A', account_status='active')
    db.session.add(teacher)
    db.session.commit()
    db.session.add(UserRole(user_id=teacher.id, role_id=teacher_role.id, department_id=comp_dept.id))
    db.session.add(TeacherAssignment(user_id=teacher.id, department_id=comp_dept.id, class_id=class_a.id, subject_name='DSA', is_class_teacher=True))
    db.session.commit()

    # Student in Class B
    student_b_user = User(institution_id=inst.id, email='student.b@college.edu', password_hash=hash_password('Student@2026!'), full_name='Student B', account_status='active')
    db.session.add(student_b_user)
    db.session.commit()
    db.session.add(UserRole(user_id=student_b_user.id, role_id=student_role.id, department_id=comp_dept.id))
    student_b = Student(user_id=student_b_user.id, college_id='CC-COMP-B01', department_id=comp_dept.id, current_class_id=class_b.id, admission_year=2025)
    db.session.add(student_b)
    db.session.commit()

    token = generate_jwt(user_id=teacher.id, email=teacher.email, role_name='teacher', department_id=comp_dept.id)

    # Access assigned Class A -> Success
    res_a = client.get(f'/api/teacher/classes/{class_a.id}/students', headers={'Authorization': f'Bearer {token}'})
    assert res_a.status_code == 200

    # Access unassigned Class B -> Forbidden (403)
    res_b = client.get(f'/api/teacher/classes/{class_b.id}/students', headers={'Authorization': f'Bearer {token}'})
    assert res_b.status_code == 403
    assert 'not assigned' in res_b.get_json()['message']

def test_student_cannot_elevate_role_or_access_admin(client):
    """Ensure Student cannot access Super Admin or Department Admin endpoints."""
    inst = Institution.query.first()
    comp_dept = Department.query.filter_by(code='COMP').first()
    student_role = Role.query.filter_by(name='student').first()

    student_user = User(institution_id=inst.id, email='student.hacker@college.edu', password_hash=hash_password('Student@2026!'), full_name='Student Hacker', account_status='active')
    db.session.add(student_user)
    db.session.commit()
    db.session.add(UserRole(user_id=student_user.id, role_id=student_role.id, department_id=comp_dept.id))
    db.session.commit()

    token = generate_jwt(user_id=student_user.id, email=student_user.email, role_name='student', department_id=comp_dept.id)

    # Attempt to access superadmin endpoint
    res_super = client.get('/api/superadmin/departments', headers={'Authorization': f'Bearer {token}'})
    assert res_super.status_code == 403

    # Attempt to access academic admin endpoint
    res_acad = client.get('/api/academic-admin/classes', headers={'Authorization': f'Bearer {token}'})
    assert res_acad.status_code == 403
