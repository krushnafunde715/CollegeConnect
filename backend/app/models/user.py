from datetime import datetime
from app.extensions import db

class Role(db.Model):
    __tablename__ = 'roles'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False) # 'super_admin', 'academic_admin', 'exam_admin', 'placement_admin', 'teacher', 'student'
    display_name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(255), nullable=True)

    user_roles = db.relationship('UserRole', backref='role', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'display_name': self.display_name,
            'description': self.description
        }


class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    institution_id = db.Column(db.Integer, db.ForeignKey('institutions.id', ondelete='CASCADE'), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False, index=True) # Institutional email only
    password_hash = db.Column(db.String(255), nullable=False) # Argon2id hash
    full_name = db.Column(db.String(150), nullable=False)
    account_status = db.Column(db.String(30), nullable=False, default='pending_verification') # 'pending_verification', 'active', 'suspended', 'disabled'
    phone_masked = db.Column(db.String(50), nullable=True) # Masked for privacy display (e.g. +91 98****1234)
    last_login_at = db.Column(db.DateTime, nullable=True)
    failed_login_attempts = db.Column(db.Integer, default=0, nullable=False)
    locked_until = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    roles = db.relationship('UserRole', backref='user', lazy=True, cascade="all, delete-orphan")
    student_profile = db.relationship('Student', backref='user', uselist=False, lazy=True, cascade="all, delete-orphan")
    teacher_assignments = db.relationship('TeacherAssignment', backref='user', lazy=True, cascade="all, delete-orphan")
    sessions = db.relationship('UserSession', backref='user', lazy=True, cascade="all, delete-orphan")
    verification_tokens = db.relationship('EmailVerificationToken', backref='user', lazy=True, cascade="all, delete-orphan")
    reset_tokens = db.relationship('PasswordResetToken', backref='user', lazy=True, cascade="all, delete-orphan")
    audit_logs = db.relationship('AuditLog', backref='user', lazy=True, foreign_keys='AuditLog.user_id')
    consents = db.relationship('ConsentRecord', backref='user', lazy=True, cascade="all, delete-orphan")

    def get_primary_role(self):
        if not self.roles:
            return None
        return self.roles[0].role.name if self.roles[0].role else None

    def get_department_id(self):
        if not self.roles:
            return None
        return self.roles[0].department_id

    def to_dict(self, include_sensitive=False):
        roles_data = []
        for ur in self.roles:
            roles_data.append({
                'role_id': ur.role_id,
                'role_name': ur.role.name if ur.role else None,
                'role_display': ur.role.display_name if ur.role else None,
                'department_id': ur.department_id,
                'department_name': ur.department.name if ur.department else None,
                'department_code': ur.department.code if ur.department else None
            })

        data = {
            'id': self.id,
            'institution_id': self.institution_id,
            'email': self.email,
            'full_name': self.full_name,
            'account_status': self.account_status,
            'phone_masked': self.phone_masked,
            'last_login_at': self.last_login_at.isoformat() if self.last_login_at else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'roles': roles_data,
            'primary_role': roles_data[0]['role_name'] if roles_data else None,
            'department_id': roles_data[0]['department_id'] if roles_data else None,
            'department_name': roles_data[0]['department_name'] if roles_data else None
        }

        if self.student_profile:
            data['student_id'] = self.student_profile.id
            data['college_id'] = self.student_profile.college_id

        return data


class UserRole(db.Model):
    __tablename__ = 'user_roles'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    role_id = db.Column(db.Integer, db.ForeignKey('roles.id', ondelete='CASCADE'), nullable=False)
    department_id = db.Column(db.Integer, db.ForeignKey('departments.id', ondelete='SET NULL'), nullable=True) # Nullable for Super Admin
    assigned_at = db.Column(db.DateTime, default=datetime.utcnow)

    __table_args__ = (
        db.UniqueConstraint('user_id', 'role_id', 'department_id', name='uq_user_role_dept'),
    )


class UserSession(db.Model):
    __tablename__ = 'user_sessions'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)
    session_token_hash = db.Column(db.String(64), unique=True, nullable=False, index=True) # SHA-256 of session identifier
    ip_address = db.Column(db.String(45), nullable=True)
    user_agent = db.Column(db.String(255), nullable=True)
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    expires_at = db.Column(db.DateTime, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    revoked_at = db.Column(db.DateTime, nullable=True)


class EmailVerificationToken(db.Model):
    __tablename__ = 'email_verification_tokens'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)
    token_hash = db.Column(db.String(64), unique=True, nullable=False, index=True) # SHA-256 of random secret
    expires_at = db.Column(db.DateTime, nullable=False)
    used_at = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def is_valid(self):
        return self.used_at is None and self.expires_at > datetime.utcnow()


class PasswordResetToken(db.Model):
    __tablename__ = 'password_reset_tokens'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)
    token_hash = db.Column(db.String(64), unique=True, nullable=False, index=True) # SHA-256 of random reset token
    expires_at = db.Column(db.DateTime, nullable=False)
    used_at = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def is_valid(self):
        return self.used_at is None and self.expires_at > datetime.utcnow()
