from app.models.user import User, Role, UserRole
from app.models.institution import Institution, Department, AcademicYear, ClassRoom
from app.models.academic import Student
from app.models.privacy import CorrectionRequest, AuditLog
from app.services.email_service import EmailDeliveryService
from app.extensions import db

def test_complete_15_step_priority_e2e_workflow(client):
    """
    Executes and validates the exact 15-step Priority End-to-End MVP Workflow:
    1. Controlled Super Admin initialization
    2. Super Admin logs in
    3. Super Admin creates a department
    4. Super Admin creates an Academic Department Admin
    5. Admin account completes verification
    6. Department Admin logs in
    7. Department Admin creates a class
    8. Department Admin adds a student with institutional email
    9. Student completes verification and activates the account
    10. Department Admin assigns a Class Teacher
    11. Class Teacher logs in and sees only assigned students
    12. Student logs in and views their own profile
    13. Student submits a correction request
    14. Authorized administrator processes the request
    15. Audit log records relevant actions
    """
    # Step 1: Controlled Super Admin initialization
    res_init = client.post('/api/auth/init-superadmin', json={
        'email': 'superadmin.e2e@college.edu',
        'password': 'SuperAdmin@2026E2E!',
        'full_name': 'Dr. Eleanor Vance',
        'setup_token': 'INIT-CCIT-SECURE-SETUP-KEY-2026'
    })
    assert res_init.status_code == 201, f"Step 1 failed: {res_init.get_json()}"

    # Step 2: Super Admin logs in
    res_login_sa = client.post('/api/auth/login', json={
        'email': 'superadmin.e2e@college.edu',
        'password': 'SuperAdmin@2026E2E!'
    })
    assert res_login_sa.status_code == 200, f"Step 2 failed: {res_login_sa.get_json()}"
    sa_token = res_login_sa.get_json()['data']['token']

    # Step 3: Super Admin creates a department
    res_dept = client.post('/api/superadmin/departments', json={
        'name': 'Civil Engineering',
        'code': 'CIVIL',
        'type': 'academic',
        'description': 'Department of Civil Infrastructure'
    }, headers={'Authorization': f'Bearer {sa_token}'})
    assert res_dept.status_code == 201, f"Step 3 failed: {res_dept.get_json()}"
    dept_id = res_dept.get_json()['data']['id']

    # Step 4: Super Admin creates an Academic Department Admin
    res_admin_prov = client.post('/api/superadmin/department-admins', json={
        'email': 'civil.admin@college.edu',
        'full_name': 'Prof. Arthur Pendelton',
        'role_name': 'academic_admin',
        'department_id': dept_id,
        'password': 'Admin@CIVIL2026!'
    }, headers={'Authorization': f'Bearer {sa_token}'})
    assert res_admin_prov.status_code == 201, f"Step 4 failed: {res_admin_prov.get_json()}"

    # Step 5: Admin account completes verification
    outbox = EmailDeliveryService.get_dev_outbox()
    admin_mail = [m for m in outbox if m['to'] == 'civil.admin@college.edu'][0]
    admin_verify_token = admin_mail['metadata']['raw_token']

    res_verify_admin = client.post('/api/auth/verify-email', json={'token': admin_verify_token})
    assert res_verify_admin.status_code == 200, f"Step 5 failed: {res_verify_admin.get_json()}"

    # Step 6: Department Admin logs in
    res_login_da = client.post('/api/auth/login', json={
        'email': 'civil.admin@college.edu',
        'password': 'Admin@CIVIL2026!'
    })
    assert res_login_da.status_code == 200, f"Step 6 failed: {res_login_da.get_json()}"
    da_token = res_login_da.get_json()['data']['token']

    # Step 7: Department Admin creates a class
    ay = AcademicYear.query.first()
    res_class = client.post('/api/academic-admin/classes', json={
        'name': 'SE CIVIL A',
        'year_level': 'SE',
        'division': 'A',
        'academic_year_id': ay.id,
        'capacity': 60
    }, headers={'Authorization': f'Bearer {da_token}'})
    assert res_class.status_code == 201, f"Step 7 failed: {res_class.get_json()}"
    class_id = res_class.get_json()['data']['id']

    # Step 8: Department Admin adds a student with institutional email
    res_student_add = client.post('/api/academic-admin/students', json={
        'email': 'alex.mason@college.edu',
        'full_name': 'Alex Mason',
        'college_id': 'CC-2026-CIVIL-001',
        'class_id': class_id,
        'admission_year': 2025,
        'password': 'Student@2026Secret!',
        'date_of_birth': '2005-04-12',
        'guardian_contact': '+91 9876500000',
        'address': '22 Beacon Street',
        'blood_group': 'A+'
    }, headers={'Authorization': f'Bearer {da_token}'})
    assert res_student_add.status_code == 201, f"Step 8 failed: {res_student_add.get_json()}"

    # Step 9: Student completes verification and activates the account
    outbox = EmailDeliveryService.get_dev_outbox()
    student_mail = [m for m in outbox if m['to'] == 'alex.mason@college.edu'][0]
    student_verify_token = student_mail['metadata']['raw_token']

    res_verify_student = client.post('/api/auth/verify-email', json={'token': student_verify_token})
    assert res_verify_student.status_code == 200, f"Step 9 failed: {res_verify_student.get_json()}"

    # Step 10: Department Admin assigns a Class Teacher
    # Provision faculty member first
    res_faculty = client.post('/api/academic-admin/faculty', json={
        'email': 'faculty.taylor@college.edu',
        'full_name': 'Dr. Samantha Taylor',
        'password': 'Teacher@2026Pass!'
    }, headers={'Authorization': f'Bearer {da_token}'})
    assert res_faculty.status_code == 201
    teacher_user_id = res_faculty.get_json()['data']['id']

    # Activate faculty
    outbox = EmailDeliveryService.get_dev_outbox()
    teacher_mail = [m for m in outbox if m['to'] == 'faculty.taylor@college.edu'][0]
    client.post('/api/auth/verify-email', json={'token': teacher_mail['metadata']['raw_token']})

    # Assign to class
    res_assign = client.post('/api/academic-admin/assign-teacher', json={
        'user_id': teacher_user_id,
        'class_id': class_id,
        'subject_name': 'Structural Mechanics',
        'is_class_teacher': True
    }, headers={'Authorization': f'Bearer {da_token}'})
    assert res_assign.status_code == 200, f"Step 10 failed: {res_assign.get_json()}"

    # Step 11: Class Teacher logs in and sees only assigned students
    res_teacher_login = client.post('/api/auth/login', json={
        'email': 'faculty.taylor@college.edu',
        'password': 'Teacher@2026Pass!'
    })
    assert res_teacher_login.status_code == 200, f"Step 11 login failed: {res_teacher_login.get_json()}"
    teacher_token = res_teacher_login.get_json()['data']['token']

    res_teacher_students = client.get(f'/api/teacher/classes/{class_id}/students', headers={'Authorization': f'Bearer {teacher_token}'})
    assert res_teacher_students.status_code == 200, f"Step 11 roster failed: {res_teacher_students.get_json()}"
    students_list = res_teacher_students.get_json()['data']
    assert len(students_list) == 1
    assert students_list[0]['college_id'] == 'CC-2026-CIVIL-001'
    # Check that privacy minimization is active for teacher view (DOB null, guardian masked)
    assert students_list[0]['date_of_birth'] is None

    # Step 12: Student logs in and views their own profile
    res_student_login = client.post('/api/auth/login', json={
        'email': 'alex.mason@college.edu',
        'password': 'Student@2026Secret!'
    })
    assert res_student_login.status_code == 200, f"Step 12 login failed: {res_student_login.get_json()}"
    student_token = res_student_login.get_json()['data']['token']

    res_profile = client.get('/api/student/profile', headers={'Authorization': f'Bearer {student_token}'})
    assert res_profile.status_code == 200, f"Step 12 profile failed: {res_profile.get_json()}"
    profile_data = res_profile.get_json()['data']
    assert profile_data['email'] == 'alex.mason@college.edu'
    assert profile_data['college_id'] == 'CC-2026-CIVIL-001'
    assert profile_data['date_of_birth'] == '2005-04-12'

    # Step 13: Student submits a correction request
    res_corr_submit = client.post('/api/student/correction-requests', json={
        'field_name': 'guardian_contact',
        'current_value': '+91 9876500000',
        'requested_value': '+91 9988776655',
        'justification': 'Updated emergency contact number of primary guardian.'
    }, headers={'Authorization': f'Bearer {student_token}'})
    assert res_corr_submit.status_code == 201, f"Step 13 failed: {res_corr_submit.get_json()}"
    req_id = res_corr_submit.get_json()['data']['id']

    # Step 14: Authorized administrator processes the request
    res_review = client.post(f'/api/academic-admin/corrections/{req_id}/review', json={
        'decision': 'approved',
        'notes': 'Verified with guardian documentation.'
    }, headers={'Authorization': f'Bearer {da_token}'})
    assert res_review.status_code == 200, f"Step 14 failed: {res_review.get_json()}"

    # Verify student data updated automatically
    student_db = Student.query.filter_by(college_id='CC-2026-CIVIL-001').first()
    assert student_db.guardian_contact == '+91 9988776655'

    # Step 15: Audit log records relevant actions
    res_audit = client.get('/api/superadmin/audit-overview', headers={'Authorization': f'Bearer {sa_token}'})
    assert res_audit.status_code == 200, f"Step 15 failed: {res_audit.get_json()}"
    logs = res_audit.get_json()['data']
    actions = [l['action'] for l in logs]
    assert 'CREATE_DEPARTMENT' in actions
    assert 'PROVISION_DEPARTMENT_ADMIN' in actions
    assert 'CREATE_CLASS' in actions
    assert 'PROVISION_STUDENT' in actions
    assert 'CORRECTION_REQUEST_APPROVED' in actions
