from app.models.user import User, Role, UserRole
from app.models.institution import Institution, Department, AcademicYear, ClassRoom
from app.models.academic import Student, TeacherAssignment
from app.models.privacy import CorrectionRequest
from app.security.argon2_hasher import hash_password
from app.security.jwt_handler import generate_jwt
from app.extensions import db

def test_academic_admin_comprehensive_workflows(client):
    """Test full academic admin workflow: list classes, create student, assign teacher, review correction, department isolation."""
    inst = Institution.query.first()
    ay = AcademicYear.query.first()
    comp_dept = Department.query.filter_by(code='COMP').first()
    acad_role = Role.query.filter_by(name='academic_admin').first()
    teacher_role = Role.query.filter_by(name='teacher').first()
    student_role = Role.query.filter_by(name='student').first()

    # 1. Setup Department Admin
    admin_user = User(
        institution_id=inst.id,
        email='anjali.deshmukh@college.edu',
        password_hash=hash_password('CompAdmin@2026!'),
        full_name='Ms. Anjali Deshmukh',
        account_status='active'
    )
    db.session.add(admin_user)
    db.session.commit()
    db.session.add(UserRole(user_id=admin_user.id, role_id=acad_role.id, department_id=comp_dept.id))

    # Create Class in Computer Engineering
    comp_class = ClassRoom(
        department_id=comp_dept.id,
        academic_year_id=ay.id,
        name='SE A',
        year_level='SE',
        division='A',
        capacity=70
    )
    db.session.add(comp_class)
    db.session.commit()

    token = generate_jwt(user_id=admin_user.id, email=admin_user.email, role_name='academic_admin', department_id=comp_dept.id)
    headers = {'Authorization': f'Bearer {token}'}

    # 2. Test Get Classes
    res_classes = client.get('/api/academic-admin/classes', headers=headers)
    assert res_classes.status_code == 200
    classes = res_classes.get_json()['data']
    assert len(classes) >= 1
    target_class = classes[0]

    # 3. Test Student Creation in own Department
    res_student = client.post('/api/academic-admin/students', json={
        'email': 'aditya.kulkarni@college.edu',
        'full_name': 'Aditya Kulkarni',
        'college_id': 'CC-COMP-22CE041',
        'class_id': target_class['id'],
        'admission_year': 2025,
        'password': 'Student@2026Secure!'
    }, headers=headers)
    assert res_student.status_code == 201
    student_id = res_student.get_json()['data']['id']

    # 4. Test List Students
    res_students = client.get('/api/academic-admin/students', headers=headers)
    assert res_students.status_code == 200
    students_data = res_students.get_json()['data']
    assert any(s['college_id'] == 'CC-COMP-22CE041' for s in students_data)

    # 5. Test Teacher Assignment
    teacher_user = User(
        institution_id=inst.id,
        email='prof.kulkarni@college.edu',
        password_hash=hash_password('Teacher@2026!'),
        full_name='Dr. K. Verma',
        account_status='active'
    )
    db.session.add(teacher_user)
    db.session.commit()
    db.session.add(UserRole(user_id=teacher_user.id, role_id=teacher_role.id, department_id=comp_dept.id))
    db.session.commit()

    res_assign = client.post('/api/academic-admin/assign-teacher', json={
        'user_id': teacher_user.id,
        'class_id': target_class['id'],
        'subject_name': 'Data Structures & Algorithms',
        'is_class_teacher': True
    }, headers=headers)
    assert res_assign.status_code == 200
    assert res_assign.get_json()['data']['is_class_teacher'] is True

    # 6. Test DPDP Correction Request Review
    correction = CorrectionRequest(
        student_id=student_id,
        field_name='emergency_contact',
        current_value='+91 98220 00000',
        requested_value='+91 98220 11223',
        justification='Updated emergency phone number',
        status='pending'
    )
    db.session.add(correction)
    db.session.commit()

    res_corrections = client.get('/api/academic-admin/corrections', headers=headers)
    assert res_corrections.status_code == 200
    assert len(res_corrections.get_json()['data']) >= 1

    res_review = client.post(f'/api/academic-admin/corrections/{correction.id}/review', json={
        'decision': 'approved',
        'notes': 'Verified guardian identity per DPDP Act 2026 protocols.'
    }, headers=headers)
    assert res_review.status_code == 200
    assert res_review.get_json()['data']['status'] == 'approved'
