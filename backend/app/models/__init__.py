from app.models.institution import Institution, Department, AcademicYear, ClassRoom
from app.models.user import Role, User, UserRole, UserSession, EmailVerificationToken, PasswordResetToken
from app.models.academic import Student, Enrollment, TeacherAssignment, AcademicRecord, Attendance
from app.models.examination import ExamSchedule, ExamRegistration, Result, HallTicket
from app.models.placement import Company, PlacementDrive, Application, Offer
from app.models.privacy import PrivacyNotice, ConsentRecord, PrivacyRequest, CorrectionRequest, AuditLog

__all__ = [
    'Institution',
    'Department',
    'AcademicYear',
    'ClassRoom',
    'Role',
    'User',
    'UserRole',
    'UserSession',
    'EmailVerificationToken',
    'PasswordResetToken',
    'Student',
    'Enrollment',
    'TeacherAssignment',
    'AcademicRecord',
    'Attendance',
    'ExamSchedule',
    'ExamRegistration',
    'Result',
    'HallTicket',
    'Company',
    'PlacementDrive',
    'Application',
    'Offer',
    'PrivacyNotice',
    'ConsentRecord',
    'PrivacyRequest',
    'CorrectionRequest',
    'AuditLog',
]
