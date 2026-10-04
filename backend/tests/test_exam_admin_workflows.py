import pytest
from app.models.user import User, Role, UserRole
from app.models.institution import Institution, Department, AcademicYear, ClassRoom
from app.models.academic import Student
from app.models.examination import ExamSchedule, ExamRegistration, Result, HallTicket
from app.security.argon2_hasher import hash_password
from app.security.jwt_handler import generate_jwt
from app.extensions import db

def test_exam_admin_complete_workflow(client):
    """Test full examination admin workflow: list schedules, create timetable, generate hall ticket with SHA-256 seal, publish result."""
    inst = Institution.query.first()
    ay = AcademicYear.query.first()
    comp_dept = Department.query.filter_by(code='COMP').first()
    exam_role = Role.query.filter_by(name='exam_admin').first()
    student_role = Role.query.filter_by(name='student').first()

    # 1. Setup Exam Admin User
    admin_user = User(
        institution_id=inst.id,
        email='suresh.patil@exam.nmiet.edu.in',
        password_hash=hash_password('ExamAdmin@2026!'),
        full_name='Mr. Suresh Patil',
        account_status='active'
    )
    db.session.add(admin_user)
    db.session.commit()
    db.session.add(UserRole(user_id=admin_user.id, role_id=exam_role.id, department_id=comp_dept.id))

    # 2. Setup Student User
    student_user = User(
        institution_id=inst.id,
        email='aditya.kulkarni@comp.nmiet.edu.in',
        password_hash=hash_password('Student@2026!'),
        full_name='Aditya Kulkarni',
        account_status='active'
    )
    db.session.add(student_user)
    db.session.commit()
    db.session.add(UserRole(user_id=student_user.id, role_id=student_role.id, department_id=comp_dept.id))

    # Setup Student Profile
    student = Student(
        user_id=student_user.id,
        department_id=comp_dept.id,
        college_id="22CE001",
        admission_year=2024,
        cgpa=9.42
    )
    db.session.add(student)
    db.session.commit()

    # Generate JWT for Exam Admin
    token = generate_jwt(user_id=admin_user.id, email=admin_user.email, role_name='exam_admin', department_id=comp_dept.id)
    headers = {'Authorization': f'Bearer {token}'}

    # 3. Test Exam Schedule Creation
    schedule_res = client.post('/api/exam/schedules', json={
        'department_id': comp_dept.id,
        'exam_name': 'End Semester Examination 2025',
        'semester': 'Semester 4',
        'subject_code': 'CS-401',
        'subject_name': 'Data Structures & Algorithms',
        'exam_date': '2025-04-15',
        'start_time': '09:00 AM',
        'end_time': '12:00 PM',
        'venue': 'Hall A-101',
        'total_marks': 100
    }, headers=headers)
    assert schedule_res.status_code == 201
    assert schedule_res.get_json()['data']['subject_name'] == 'Data Structures & Algorithms'

    # 4. Test Listing Schedules
    list_res = client.get('/api/exam/schedules', headers=headers)
    assert list_res.status_code == 200
    assert len(list_res.get_json()['data']) >= 1

    # 5. Test Hall Ticket Generation with Cryptographic Hash
    ht_res = client.post('/api/exam/hall-tickets/generate', json={
        'student_id': student.id,
        'exam_name': 'End Semester Examination 2025',
        'venue': 'Hall A-101'
    }, headers=headers)
    assert ht_res.status_code == 201
    ht_data = ht_res.get_json()['data']
    assert ht_data['verification_hash'] is not None
    assert len(ht_data['verification_hash']) == 64  # SHA-256 is 64 hex characters

    # 6. Test Results Publishing
    res_publish = client.post('/api/exam/results', json={
        'student_id': student.id,
        'semester': 'Semester 4',
        'exam_name': 'End Semester Examination 2025',
        'sgpa': 9.20,
        'cgpa': 9.35,
        'total_credits': 22.0,
        'status': 'pass',
        'remarks': 'First Class with Distinction'
    }, headers=headers)
    assert res_publish.status_code == 201
    assert res_publish.get_json()['data']['sgpa'] == 9.20

    # 7. Verify Student CGPA Updated in Database
    updated_student = db.session.get(Student, student.id)
    assert updated_student.cgpa == 9.35

    # 8. Test Unauthorized Access (Student token cannot access /api/exam/schedules POST)
    student_token = generate_jwt(user_id=student_user.id, email=student_user.email, role_name='student', department_id=comp_dept.id)
    student_headers = {'Authorization': f'Bearer {student_token}'}

    forbidden_res = client.post('/api/exam/schedules', json={
        'department_id': comp_dept.id,
        'exam_name': 'Unauthorized Schedule',
        'subject_code': 'CS-999',
        'exam_date': '2025-05-01'
    }, headers=student_headers)
    assert forbidden_res.status_code == 403
