from datetime import datetime
from app.extensions import db

class PrivacyNotice(db.Model):
    __tablename__ = 'privacy_notices'

    id = db.Column(db.Integer, primary_key=True)
    institution_id = db.Column(db.Integer, db.ForeignKey('institutions.id', ondelete='CASCADE'), nullable=False)
    version = db.Column(db.String(20), nullable=False, default="1.0")
    title = db.Column(db.String(200), nullable=False)
    purpose = db.Column(db.Text, nullable=False)
    data_categories_collected = db.Column(db.JSON, nullable=False) # List of categories: Identity, Academic, Contact, Examination
    retention_period = db.Column(db.String(150), nullable=False) # e.g. "Active enrollment + 5 years statutory audit"
    effective_date = db.Column(db.Date, nullable=False)
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    consents = db.relationship('ConsentRecord', backref='privacy_notice', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'institution_id': self.institution_id,
            'version': self.version,
            'title': self.title,
            'purpose': self.purpose,
            'data_categories_collected': self.data_categories_collected,
            'retention_period': self.retention_period,
            'effective_date': self.effective_date.isoformat() if self.effective_date else None,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class ConsentRecord(db.Model):
    __tablename__ = 'consent_records'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    privacy_notice_id = db.Column(db.Integer, db.ForeignKey('privacy_notices.id', ondelete='CASCADE'), nullable=False)
    consent_type = db.Column(db.String(50), nullable=False) # 'academic_processing', 'placement_data_sharing', 'notification_alerts'
    granted = db.Column(db.Boolean, default=True, nullable=False)
    ip_address = db.Column(db.String(45), nullable=True)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'privacy_notice_id': self.privacy_notice_id,
            'notice_title': self.privacy_notice.title if self.privacy_notice else None,
            'consent_type': self.consent_type,
            'granted': self.granted,
            'ip_address': self.ip_address,
            'timestamp': self.timestamp.isoformat() if self.timestamp else None
        }


class PrivacyRequest(db.Model):
    __tablename__ = 'privacy_requests'

    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('students.id', ondelete='CASCADE'), nullable=False)
    request_type = db.Column(db.String(50), nullable=False) # 'data_access', 'consent_withdrawal', 'erasure_inquiry', 'grievance'
    status = db.Column(db.String(30), default='pending', nullable=False) # 'pending', 'in_review', 'approved', 'rejected', 'completed'
    details = db.Column(db.Text, nullable=False)
    response_notes = db.Column(db.Text, nullable=True)
    requested_at = db.Column(db.DateTime, default=datetime.utcnow)
    resolved_at = db.Column(db.DateTime, nullable=True)
    resolved_by_user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='SET NULL'), nullable=True)

    def to_dict(self):
        return {
            'id': self.id,
            'student_id': self.student_id,
            'student_name': self.student.user.full_name if self.student and self.student.user else None,
            'college_id': self.student.college_id if self.student else None,
            'request_type': self.request_type,
            'status': self.status,
            'details': self.details,
            'response_notes': self.response_notes,
            'requested_at': self.requested_at.isoformat() if self.requested_at else None,
            'resolved_at': self.resolved_at.isoformat() if self.resolved_at else None,
            'resolved_by_user_id': self.resolved_by_user_id
        }


class CorrectionRequest(db.Model):
    __tablename__ = 'correction_requests'

    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('students.id', ondelete='CASCADE'), nullable=False)
    field_name = db.Column(db.String(100), nullable=False) # e.g. 'full_name', 'phone_masked', 'guardian_contact', 'date_of_birth', 'address'
    current_value = db.Column(db.String(255), nullable=True)
    requested_value = db.Column(db.String(255), nullable=False)
    justification = db.Column(db.Text, nullable=False)
    status = db.Column(db.String(30), default='pending', nullable=False) # 'pending', 'approved', 'rejected'
    reviewed_by_user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='SET NULL'), nullable=True)
    review_notes = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    reviewed_at = db.Column(db.DateTime, nullable=True)

    def to_dict(self):
        return {
            'id': self.id,
            'student_id': self.student_id,
            'student_name': self.student.user.full_name if self.student and self.student.user else None,
            'college_id': self.student.college_id if self.student else None,
            'department_id': self.student.department_id if self.student else None,
            'department_name': self.student.department.name if self.student and self.student.department else None,
            'field_name': self.field_name,
            'current_value': self.current_value,
            'requested_value': self.requested_value,
            'justification': self.justification,
            'status': self.status,
            'reviewed_by_user_id': self.reviewed_by_user_id,
            'review_notes': self.review_notes,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'reviewed_at': self.reviewed_at.isoformat() if self.reviewed_at else None
        }


class AuditLog(db.Model):
    __tablename__ = 'audit_logs'

    id = db.Column(db.Integer, primary_key=True)
    institution_id = db.Column(db.Integer, db.ForeignKey('institutions.id', ondelete='CASCADE'), nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='SET NULL'), nullable=True)
    action = db.Column(db.String(100), nullable=False, index=True) # 'LOGIN_SUCCESS', 'LOGIN_FAILED', 'CREATE_STUDENT', 'CORRECTION_APPROVED', etc.
    resource_type = db.Column(db.String(50), nullable=True) # 'user', 'student', 'class', 'department', 'academic_record'
    resource_id = db.Column(db.String(50), nullable=True)
    department_id = db.Column(db.Integer, db.ForeignKey('departments.id', ondelete='SET NULL'), nullable=True)
    ip_address = db.Column(db.String(45), nullable=True)
    user_agent = db.Column(db.String(255), nullable=True)
    status = db.Column(db.String(20), default='success', nullable=False) # 'success', 'denied', 'failed'
    details = db.Column(db.JSON, default=dict)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow, index=True)

    def to_dict(self):
        return {
            'id': self.id,
            'institution_id': self.institution_id,
            'user_id': self.user_id,
            'user_name': self.user.full_name if self.user else 'System/Anonymous',
            'user_email': self.user.email if self.user else None,
            'action': self.action,
            'resource_type': self.resource_type,
            'resource_id': self.resource_id,
            'department_id': self.department_id,
            'ip_address': self.ip_address,
            'status': self.status,
            'details': self.details or {},
            'timestamp': self.timestamp.isoformat() if self.timestamp else None
        }
