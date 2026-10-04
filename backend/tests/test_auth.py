import json
from app.models.user import User, Role, UserRole, EmailVerificationToken, PasswordResetToken
from app.models.institution import Institution
from app.security.argon2_hasher import hash_password, verify_password
from app.services.email_service import EmailDeliveryService

def test_controlled_superadmin_init(client):
    """Verify that Super Admin can be initialized with setup key, and cannot be re-initialized."""
    res = client.post('/api/auth/init-superadmin', json={
        'email': 'superadmin@college.edu',
        'password': 'SuperAdmin@2026Password!',
        'full_name': 'Dr. Test SuperAdmin',
        'setup_token': 'INIT-CCIT-SECURE-SETUP-KEY-2026'
    })
    assert res.status_code == 201
    data = res.get_json()
    assert data['status'] == 'success'
    assert data['data']['email'] == 'superadmin@college.edu'

    # Attempt second initialization with the same key -> Must be rejected
    res2 = client.post('/api/auth/init-superadmin', json={
        'email': 'superadmin2@college.edu',
        'password': 'SuperAdmin@2026Password!',
        'full_name': 'Another SuperAdmin',
        'setup_token': 'INIT-CCIT-SECURE-SETUP-KEY-2026'
    })
    assert res2.status_code == 400
    assert 'already initialized' in res2.get_json()['message']

def test_login_authentication_and_argon2(client):
    """Test user login with Argon2 verified hash, and generic failure on bad password."""
    # First create superadmin
    client.post('/api/auth/init-superadmin', json={
        'email': 'superadmin@college.edu',
        'password': 'SuperAdmin@2026Password!',
        'full_name': 'Super Admin',
        'setup_token': 'INIT-CCIT-SECURE-SETUP-KEY-2026'
    })

    # Successful login
    res = client.post('/api/auth/login', json={
        'email': 'superadmin@college.edu',
        'password': 'SuperAdmin@2026Password!'
    })
    assert res.status_code == 200
    data = res.get_json()
    assert data['status'] == 'success'
    assert 'token' in data['data']
    assert data['data']['role'] == 'super_admin'

    # Failed login with wrong password
    res_bad = client.post('/api/auth/login', json={
        'email': 'superadmin@college.edu',
        'password': 'WrongPassword123!'
    })
    assert res_bad.status_code == 401
    # Generic error message to avoid enumeration
    assert 'Invalid institutional email or password' in res_bad.get_json()['message']

def test_pending_verification_account_blocked(client):
    """Test that accounts in pending_verification cannot log in until email is verified."""
    inst = Institution.query.first()
    student_role = Role.query.filter_by(name='student').first()

    # Create unverified user
    unverified_user = User(
        institution_id=inst.id,
        email='newstudent@college.edu',
        password_hash=hash_password('Student@2026Password!'),
        full_name='Unverified Student',
        account_status='pending_verification'
    )
    from app.extensions import db
    db.session.add(unverified_user)
    db.session.commit()
    db.session.add(UserRole(user_id=unverified_user.id, role_id=student_role.id))
    db.session.commit()

    # Attempt login before verification
    res = client.post('/api/auth/login', json={
        'email': 'newstudent@college.edu',
        'password': 'Student@2026Password!'
    })
    assert res.status_code == 403
    assert res.get_json()['code'] == 'PENDING_VERIFICATION'

def test_email_verification_workflow(client):
    """Test full email verification token lifecycle: dispatch -> verify -> activate -> token invalidated."""
    inst = Institution.query.first()
    student_role = Role.query.filter_by(name='student').first()
    from app.extensions import db
    from app.services.auth_service import AuthService

    user = User(
        institution_id=inst.id,
        email='verify.test@college.edu',
        password_hash=hash_password('Student@2026Password!'),
        full_name='Verify Test Student',
        account_status='pending_verification'
    )
    db.session.add(user)
    db.session.commit()
    db.session.add(UserRole(user_id=user.id, role_id=student_role.id))
    db.session.commit()

    # Dispatch verification email
    delivery = AuthService.send_verification_email(user)
    assert delivery['success'] is True

    # Retrieve token from dev outbox
    outbox = EmailDeliveryService.get_dev_outbox()
    assert len(outbox) > 0
    token_item = [m for m in outbox if m['to'] == 'verify.test@college.edu'][0]
    raw_token = token_item['metadata']['raw_token']

    # Verify with valid token
    res = client.post('/api/auth/verify-email', json={'token': raw_token})
    assert res.status_code == 200
    assert 'verified successfully' in res.get_json()['message']

    # Check that user is now active in database
    db.session.refresh(user)
    assert user.account_status == 'active'

    # Attempt to re-use the token (single-use enforcement)
    res_reuse = client.post('/api/auth/verify-email', json={'token': raw_token})
    assert res_reuse.status_code == 400
    assert 'Invalid or expired' in res_reuse.get_json()['message']

def test_password_reset_workflow(client):
    """Test forgot-password generic response, token issuance, and password reset."""
    inst = Institution.query.first()
    student_role = Role.query.filter_by(name='student').first()
    from app.extensions import db

    user = User(
        institution_id=inst.id,
        email='reset.user@college.edu',
        password_hash=hash_password('OldPassword@2026!'),
        full_name='Reset User',
        account_status='active'
    )
    db.session.add(user)
    db.session.commit()
    db.session.add(UserRole(user_id=user.id, role_id=student_role.id))
    db.session.commit()

    # Request password reset
    res = client.post('/api/auth/forgot-password', json={'email': 'reset.user@college.edu'})
    assert res.status_code == 200
    assert 'reset link has been dispatched' in res.get_json()['message']

    # Non-existent email should return same generic response to prevent enumeration
    res_fake = client.post('/api/auth/forgot-password', json={'email': 'nonexistent@college.edu'})
    assert res_fake.status_code == 200
    assert 'reset link has been dispatched' in res_fake.get_json()['message']

    # Get reset token from dev outbox
    outbox = EmailDeliveryService.get_dev_outbox()
    reset_item = [m for m in outbox if m['to'] == 'reset.user@college.edu'][0]
    raw_token = reset_item['metadata']['raw_token']

    # Reset password with new strong password
    res_reset = client.post('/api/auth/reset-password', json={
        'token': raw_token,
        'new_password': 'BrandNewPassword@2026!'
    })
    assert res_reset.status_code == 200
    assert 'reset successfully' in res_reset.get_json()['message']

    # Login with new password
    res_login = client.post('/api/auth/login', json={
        'email': 'reset.user@college.edu',
        'password': 'BrandNewPassword@2026!'
    })
    assert res_login.status_code == 200
