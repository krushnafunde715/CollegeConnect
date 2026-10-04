import os
from datetime import datetime, timedelta
from flask import current_app, request
from app.extensions import db
from app.models.institution import Institution, Department, AcademicYear
from app.models.user import User, Role, UserRole, UserSession, EmailVerificationToken, PasswordResetToken
from app.models.academic import Student
from app.security.argon2_hasher import hash_password, verify_password, validate_password_strength
from app.security.tokens import generate_secure_token, hash_token, calculate_token_expiration
from app.security.jwt_handler import generate_jwt
from app.security.audit import log_audit
from app.services.email_service import EmailDeliveryService

class AuthService:
    @staticmethod
    def initialize_super_admin(email: str, password: str, full_name: str, setup_token: str, institution_name: str = None, institution_code: str = None, institution_domain: str = None):
        """
        Controlled initial setup process for Super Admin:
        - Validates setup token
        - Ensures no existing active Super Admin exists or system is in initial state
        - Initializes Default Institution, Roles, and Super Admin User
        """
        config_setup_token = current_app.config.get('INITIAL_SETUP_TOKEN')
        if setup_token != config_setup_token:
            log_audit(action='SUPERADMIN_INIT_FAILED', status='denied', details={'reason': 'Invalid setup token', 'email': email})
            return False, "Invalid initial setup authorization key.", None

        # Check if a super admin already exists
        super_admin_role = Role.query.filter_by(name='super_admin').first()
        if super_admin_role:
            existing_super_admin = UserRole.query.filter_by(role_id=super_admin_role.id).first()
            if existing_super_admin:
                return False, "Super Admin account is already initialized. Controlled setup can only run once.", None

        # Validate password strength
        valid, msg = validate_password_strength(password)
        if not valid:
            return False, msg, None

        # Ensure roles exist
        roles_to_seed = [
            ('super_admin', 'Super College Admin', 'Full institutional oversight and department admin management'),
            ('academic_admin', 'Academic Department Admin', 'Manages classes, students, and faculty assignments within department'),
            ('exam_admin', 'Exam Department Admin', 'Manages schedules, hall tickets, and results'),
            ('placement_admin', 'Placement Department Admin', 'Manages company drives, applications, and placement offers'),
            ('teacher', 'Class Teacher / Faculty', 'Manages assigned class attendance, academic records, and student progress'),
            ('student', 'Student', 'Views own academic records, privacy requests, exams, and placement drives')
        ]
        for role_name, display_name, desc in roles_to_seed:
            r = Role.query.filter_by(name=role_name).first()
            if not r:
                r = Role(name=role_name, display_name=display_name, description=desc)
                db.session.add(r)
        db.session.commit()

        # Ensure default Institution exists
        inst = Institution.query.first()
        if not inst:
            inst = Institution(
                name=institution_name or current_app.config.get('INSTITUTION_NAME', 'CollegeConnect Institute of Technology'),
                code=institution_code or current_app.config.get('INSTITUTION_CODE', 'CCIT'),
                domain=institution_domain or current_app.config.get('INSTITUTION_DOMAIN', 'college.edu'),
                contact_email=f"admin@{institution_domain or current_app.config.get('INSTITUTION_DOMAIN', 'college.edu')}",
                settings={"privacy_policy_version": "1.0", "dpdp_compliance_mode": True}
            )
            db.session.add(inst)
            db.session.commit()

        # Create Super Admin User
        super_admin = User.query.filter_by(email=email.strip().lower()).first()
        if not super_admin:
            super_admin = User(
                institution_id=inst.id,
                email=email.strip().lower(),
                password_hash=hash_password(password),
                full_name=full_name.strip(),
                account_status='active', # Super admin initialized as active
                phone_masked="+91 99****0001"
            )
            db.session.add(super_admin)
            db.session.commit()

        super_role = Role.query.filter_by(name='super_admin').first()
        ur = UserRole(user_id=super_admin.id, role_id=super_role.id, department_id=None)
        db.session.add(ur)
        db.session.commit()

        log_audit(
            action='SUPERADMIN_INITIALIZED',
            resource_type='user',
            resource_id=str(super_admin.id),
            user_id=super_admin.id,
            institution_id=inst.id,
            details={'email': super_admin.email, 'institution': inst.name}
        )

        return True, "Super Admin initialized successfully.", super_admin

    @staticmethod
    def authenticate_user(email: str, password: str, ip_address: str = None, user_agent: str = None):
        """
        Authenticate registered institutional email + password.
        - Verifies Argon2 hash
        - Checks account status (blocks pending verification / disabled)
        - Creates UserSession
        - Issues signed JWT token
        - Employs generic error messages to prevent enumeration
        """
        clean_email = email.strip().lower()
        user = User.query.filter_by(email=clean_email).first()

        # Generic failure message for security
        GENERIC_AUTH_ERROR = "Invalid institutional email or password."

        if not user:
            log_audit(
                action='LOGIN_FAILED_UNKNOWN_EMAIL',
                status='denied',
                details={'attempted_email': clean_email}
            )
            return False, GENERIC_AUTH_ERROR, None, None

        # Check account lockout / failure count
        if user.locked_until and user.locked_until > datetime.utcnow():
            remaining_mins = int((user.locked_until - datetime.utcnow()).total_seconds() / 60) + 1
            return False, f"Account is temporarily locked due to multiple failed login attempts. Try again in {remaining_mins} minutes.", None, None

        # Verify password with Argon2
        if not verify_password(password, user.password_hash):
            user.failed_login_attempts = (user.failed_login_attempts or 0) + 1
            if user.failed_login_attempts >= 5:
                user.locked_until = datetime.utcnow() + timedelta(minutes=15)
                log_audit(action='ACCOUNT_LOCKED', resource_type='user', resource_id=str(user.id), user_id=user.id, details={'attempts': user.failed_login_attempts})
            db.session.commit()

            log_audit(
                action='LOGIN_FAILED_BAD_PASSWORD',
                resource_type='user',
                resource_id=str(user.id),
                user_id=user.id,
                status='denied',
                details={'email': user.email}
            )
            return False, GENERIC_AUTH_ERROR, None, None

        # Check account status
        if user.account_status == 'pending_verification':
            return False, "Your account is pending institutional email verification. Please check your inbox or request a new verification link.", 'PENDING_VERIFICATION', user
        elif user.account_status in ['suspended', 'disabled']:
            return False, f"Your account has been {user.account_status}. Please contact your administrator.", 'ACCOUNT_DISABLED', None

        # Reset failed attempts upon successful login
        user.failed_login_attempts = 0
        user.locked_until = None
        user.last_login_at = datetime.utcnow()

        # Create session record
        session_token_raw = generate_secure_token()
        session_hash = hash_token(session_token_raw)
        session_expiry = datetime.utcnow() + current_app.config['JWT_ACCESS_TOKEN_EXPIRES']

        session = UserSession(
            user_id=user.id,
            session_token_hash=session_hash,
            ip_address=ip_address or request.remote_addr if request else "127.0.0.1",
            user_agent=(user_agent or (request.user_agent.string if request and request.user_agent else "unknown"))[:255],
            expires_at=session_expiry,
            is_active=True
        )
        db.session.add(session)
        db.session.commit()

        # Issue JWT with role and department info
        primary_role = user.get_primary_role()
        dept_id = user.get_department_id()
        jwt_token = generate_jwt(
            user_id=user.id,
            email=user.email,
            role_name=primary_role,
            department_id=dept_id,
            session_id=session.id
        )

        log_audit(
            action='LOGIN_SUCCESS',
            resource_type='user',
            resource_id=str(user.id),
            user_id=user.id,
            status='success',
            details={'role': primary_role, 'department_id': dept_id}
        )

        return True, "Login successful.", jwt_token, user

    @staticmethod
    def send_verification_email(user: User):
        """
        Generates a cryptographically random verification token, stores SHA-256 hash, and sends email.
        """
        raw_token = generate_secure_token()
        token_h = hash_token(raw_token)
        expiry = calculate_token_expiration(hours=current_app.config.get('VERIFICATION_TOKEN_EXPIRE_HOURS', 24))

        # Invalidate old unused verification tokens
        EmailVerificationToken.query.filter_by(user_id=user.id, used_at=None).delete()

        token_record = EmailVerificationToken(
            user_id=user.id,
            token_hash=token_h,
            expires_at=expiry
        )
        db.session.add(token_record)
        db.session.commit()

        # Build verification URL
        # e.g. http://localhost:5173/verify-email?token=...
        verify_url = f"http://localhost:5173/verify-email?token={raw_token}&email={user.email}"

        html_body = f"""
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
            <h2 style="color: #1e3a8a;">CollegeConnect Account Activation</h2>
            <p>Hello <strong>{user.full_name}</strong>,</p>
            <p>Your institutional account has been provisioned. Please verify your registered institutional email to activate your account:</p>
            <p style="text-align: center; margin: 30px 0;">
                <a href="{verify_url}" style="background-color: #2563eb; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Activate Account</a>
            </p>
            <p>Or use this verification link:</p>
            <p style="word-break: break-all; color: #4b5563; font-size: 13px;">{verify_url}</p>
            <p style="color: #64748b; font-size: 12px; margin-top: 30px;">This link is single-use and will expire in 24 hours.<br>If you did not request this account, contact your institution's IT administrator.</p>
        </div>
        """

        delivery_result = EmailDeliveryService.send_email(
            to_email=user.email,
            subject="Activate Your CollegeConnect Account",
            html_content=html_body,
            text_content=f"Verify your CollegeConnect account: {verify_url}",
            metadata={'type': 'email_verification', 'user_id': user.id, 'raw_token': raw_token, 'verify_url': verify_url}
        )

        return delivery_result

    @staticmethod
    def verify_email_token(raw_token: str):
        """
        Validates token hash, checks expiry, marks account active, invalidates token single-use.
        """
        token_h = hash_token(raw_token.strip())
        token_record = EmailVerificationToken.query.filter_by(token_hash=token_h).first()

        if not token_record or not token_record.is_valid():
            return False, "Invalid or expired verification link. Please request a new verification email."

        user = User.query.get(token_record.user_id)
        if not user:
            return False, "Associated user account was not found."

        # Mark token as used
        token_record.used_at = datetime.utcnow()
        user.account_status = 'active'
        db.session.commit()

        log_audit(
            action='EMAIL_VERIFIED',
            resource_type='user',
            resource_id=str(user.id),
            user_id=user.id,
            status='success',
            details={'email': user.email}
        )

        return True, "Your institutional email has been verified successfully. You may now sign in."

    @staticmethod
    def initiate_forgot_password(email: str):
        """
        Password reset request:
        - Returns a generic message to prevent account enumeration
        - If user exists, generates time-limited single-use token and sends reset link
        """
        clean_email = email.strip().lower()
        user = User.query.filter_by(email=clean_email).first()

        GENERIC_RESPONSE = "If your institutional email is registered with us, a password reset link has been dispatched."

        if not user or user.account_status in ['suspended', 'disabled']:
            # Return generic message
            return True, GENERIC_RESPONSE, None

        raw_token = generate_secure_token()
        token_h = hash_token(raw_token)
        expiry = calculate_token_expiration(minutes=current_app.config.get('RESET_TOKEN_EXPIRE_MINUTES', 60))

        # Invalidate old unused reset tokens
        PasswordResetToken.query.filter_by(user_id=user.id, used_at=None).delete()

        reset_record = PasswordResetToken(
            user_id=user.id,
            token_hash=token_h,
            expires_at=expiry
        )
        db.session.add(reset_record)
        db.session.commit()

        reset_url = f"http://localhost:5173/reset-password?token={raw_token}&email={user.email}"

        html_body = f"""
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
            <h2 style="color: #1e3a8a;">CollegeConnect Password Reset Request</h2>
            <p>Hello <strong>{user.full_name}</strong>,</p>
            <p>We received a request to reset your password. Click the button below to set a new password:</p>
            <p style="text-align: center; margin: 30px 0;">
                <a href="{reset_url}" style="background-color: #2563eb; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Reset Password</a>
            </p>
            <p>Or use this reset link:</p>
            <p style="word-break: break-all; color: #4b5563; font-size: 13px;">{reset_url}</p>
            <p style="color: #64748b; font-size: 12px; margin-top: 30px;">This link is single-use and will expire in 60 minutes.<br>If you did not request a password reset, please notify your administrator immediately.</p>
        </div>
        """

        delivery_result = EmailDeliveryService.send_email(
            to_email=user.email,
            subject="CollegeConnect Password Reset",
            html_content=html_body,
            text_content=f"Reset your password: {reset_url}",
            metadata={'type': 'password_reset', 'user_id': user.id, 'raw_token': raw_token, 'reset_url': reset_url}
        )

        log_audit(
            action='PASSWORD_RESET_REQUESTED',
            resource_type='user',
            resource_id=str(user.id),
            user_id=user.id,
            status='success',
            details={'email': user.email, 'delivery_mode': delivery_result.get('mode')}
        )

        return True, GENERIC_RESPONSE, delivery_result

    @staticmethod
    def complete_password_reset(raw_token: str, new_password: str):
        """
        Validates reset token, updates password hash using Argon2, invalidates token and active sessions.
        """
        valid, msg = validate_password_strength(new_password)
        if not valid:
            return False, msg

        token_h = hash_token(raw_token.strip())
        reset_record = PasswordResetToken.query.filter_by(token_hash=token_h).first()

        if not reset_record or not reset_record.is_valid():
            return False, "Invalid or expired password reset token."

        user = User.query.get(reset_record.user_id)
        if not user:
            return False, "Associated user account was not found."

        # Update password hash
        user.password_hash = hash_password(new_password)
        reset_record.used_at = datetime.utcnow()

        # Invalidate all active sessions for security
        UserSession.query.filter_by(user_id=user.id, is_active=True).update({
            'is_active': False,
            'revoked_at': datetime.utcnow()
        })

        db.session.commit()

        log_audit(
            action='PASSWORD_RESET_COMPLETED',
            resource_type='user',
            resource_id=str(user.id),
            user_id=user.id,
            status='success',
            details={'email': user.email}
        )

        return True, "Your password has been reset successfully. Please log in with your new password."

    @staticmethod
    def logout_user(session_id: int = None, user_id: int = None):
        """Revoke active session on logout."""
        if session_id:
            session = UserSession.query.get(session_id)
            if session:
                session.is_active = False
                session.revoked_at = datetime.utcnow()
                db.session.commit()

        log_audit(
            action='LOGOUT',
            resource_type='user',
            resource_id=str(user_id) if user_id else None,
            user_id=user_id,
            status='success'
        )
        return True
