from app.models.user import User, Role, UserRole
from app.models.institution import Institution, Department, AcademicYear, ClassRoom
from app.models.academic import Student
from app.models.privacy import PrivacyNotice, ConsentRecord, PrivacyRequest, CorrectionRequest
from app.security.argon2_hasher import hash_password
from app.security.jwt_handler import generate_jwt
from app.extensions import db

def test_student_privacy_center_and_consents(client):
    """Test DPDP Privacy Notice retrieval, consent grant/revocation, and privacy requests."""
    inst = Institution.query.first()
    comp_dept = Department.query.filter_by(code='COMP').first()
    ay = AcademicYear.query.first()
    student_role = Role.query.filter_by(name='student').first()

    classroom = ClassRoom(department_id=comp_dept.id, academic_year_id=ay.id, name='SE A', year_level='SE', division='A')
    db.session.add(classroom)
    db.session.commit()

    student_user = User(
        institution_id=inst.id,
        email='priya.nair@college.edu',
        password_hash=hash_password('Student@2026Priya!'),
        full_name='Priya Nair',
        account_status='active',
        phone_masked='+91 98****9988'
    )
    db.session.add(student_user)
    db.session.commit()
    db.session.add(UserRole(user_id=student_user.id, role_id=student_role.id, department_id=comp_dept.id))

    student = Student(
        user_id=student_user.id,
        college_id='CC-2026-COMP-099',
        department_id=comp_dept.id,
        current_class_id=classroom.id,
        admission_year=2025,
        cgpa=8.95,
        address='15 Garden Valley Road',
        guardian_contact='+91 9876549988'
    )
    db.session.add(student)
    db.session.commit()

    token = generate_jwt(user_id=student_user.id, email=student_user.email, role_name='student', department_id=comp_dept.id)

    # 1. Fetch Privacy Notices
    res_notices = client.get('/api/student/privacy/notices', headers={'Authorization': f'Bearer {token}'})
    assert res_notices.status_code == 200
    assert len(res_notices.get_json()['data']['notices']) >= 1

    # 2. Record new consent
    res_consent = client.post('/api/student/privacy/consent', json={
        'consent_type': 'placement_data_sharing',
        'granted': True
    }, headers={'Authorization': f'Bearer {token}'})
    assert res_consent.status_code == 200
    assert res_consent.get_json()['data']['consent_type'] == 'placement_data_sharing'

    # 3. Submit Privacy Request (Data Access Inquiry)
    res_req = client.post('/api/student/privacy/requests', json={
        'request_type': 'data_access',
        'details': 'Requesting full summary of personal demographic and academic records stored by the institution.'
    }, headers={'Authorization': f'Bearer {token}'})
    assert res_req.status_code == 201
    assert res_req.get_json()['data']['request_type'] == 'data_access'

    # 4. List Student Privacy Requests
    res_list = client.get('/api/student/privacy/requests', headers={'Authorization': f'Bearer {token}'})
    assert res_list.status_code == 200
    assert len(res_list.get_json()['data']) >= 1
