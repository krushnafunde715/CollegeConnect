from datetime import datetime
from app.extensions import db

class ExamSchedule(db.Model):
    __tablename__ = 'exam_schedules'

    id = db.Column(db.Integer, primary_key=True)
    department_id = db.Column(db.Integer, db.ForeignKey('departments.id', ondelete='CASCADE'), nullable=False)
    academic_year_id = db.Column(db.Integer, db.ForeignKey('academic_years.id', ondelete='CASCADE'), nullable=False)
    exam_name = db.Column(db.String(100), nullable=False) # e.g. "End Semester Examination - Winter 2026"
    semester = db.Column(db.String(20), nullable=False) # e.g. "Semester 3"
    subject_code = db.Column(db.String(20), nullable=False)
    subject_name = db.Column(db.String(100), nullable=False)
    exam_date = db.Column(db.Date, nullable=False)
    start_time = db.Column(db.String(20), nullable=False) # e.g. "10:00 AM"
    end_time = db.Column(db.String(20), nullable=False) # e.g. "01:00 PM"
    venue = db.Column(db.String(100), nullable=False, default="Examination Hall A")
    total_marks = db.Column(db.Integer, default=100)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    registrations = db.relationship('ExamRegistration', backref='schedule', lazy=True, cascade="all, delete-orphan")

    def to_dict(self):
        return {
            'id': self.id,
            'department_id': self.department_id,
            'academic_year_id': self.academic_year_id,
            'exam_name': self.exam_name,
            'semester': self.semester,
            'subject_code': self.subject_code,
            'subject_name': self.subject_name,
            'exam_date': self.exam_date.isoformat() if self.exam_date else None,
            'start_time': self.start_time,
            'end_time': self.end_time,
            'venue': self.venue,
            'total_marks': self.total_marks,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class ExamRegistration(db.Model):
    __tablename__ = 'exam_registrations'

    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('students.id', ondelete='CASCADE'), nullable=False)
    exam_schedule_id = db.Column(db.Integer, db.ForeignKey('exam_schedules.id', ondelete='CASCADE'), nullable=False)
    status = db.Column(db.String(30), default='registered', nullable=False) # 'registered', 'approved', 'cancelled'
    fee_paid = db.Column(db.Boolean, default=True)
    registered_at = db.Column(db.DateTime, default=datetime.utcnow)

    __table_args__ = (
        db.UniqueConstraint('student_id', 'exam_schedule_id', name='uq_student_exam_registration'),
    )

    def to_dict(self):
        return {
            'id': self.id,
            'student_id': self.student_id,
            'student_name': self.student.user.full_name if self.student and self.student.user else None,
            'college_id': self.student.college_id if self.student else None,
            'exam_schedule_id': self.exam_schedule_id,
            'exam_name': self.schedule.exam_name if self.schedule else None,
            'subject_name': self.schedule.subject_name if self.schedule else None,
            'subject_code': self.schedule.subject_code if self.schedule else None,
            'exam_date': self.schedule.exam_date.isoformat() if self.schedule and self.schedule.exam_date else None,
            'status': self.status,
            'registered_at': self.registered_at.isoformat() if self.registered_at else None
        }


class Result(db.Model):
    __tablename__ = 'results'

    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('students.id', ondelete='CASCADE'), nullable=False)
    semester = db.Column(db.String(20), nullable=False) # e.g. "Semester 3"
    exam_name = db.Column(db.String(100), nullable=False)
    sgpa = db.Column(db.Float, nullable=False, default=0.0)
    cgpa = db.Column(db.Float, nullable=False, default=0.0)
    total_credits = db.Column(db.Float, default=24.0)
    status = db.Column(db.String(20), default='pass', nullable=False) # 'pass', 'fail', 'withheld'
    published_date = db.Column(db.Date, default=datetime.utcnow)
    remarks = db.Column(db.String(255), nullable=True)

    __table_args__ = (
        db.UniqueConstraint('student_id', 'semester', 'exam_name', name='uq_student_result_sem'),
    )

    def to_dict(self):
        return {
            'id': self.id,
            'student_id': self.student_id,
            'student_name': self.student.user.full_name if self.student and self.student.user else None,
            'college_id': self.student.college_id if self.student else None,
            'semester': self.semester,
            'exam_name': self.exam_name,
            'sgpa': self.sgpa,
            'cgpa': self.cgpa,
            'total_credits': self.total_credits,
            'status': self.status,
            'published_date': self.published_date.isoformat() if self.published_date else None,
            'remarks': self.remarks
        }


class HallTicket(db.Model):
    __tablename__ = 'hall_tickets'

    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('students.id', ondelete='CASCADE'), nullable=False)
    exam_name = db.Column(db.String(100), nullable=False)
    ticket_number = db.Column(db.String(50), unique=True, nullable=False)
    issued_date = db.Column(db.Date, default=datetime.utcnow)
    verification_hash = db.Column(db.String(64), nullable=False) # Tamper-proof hash
    status = db.Column(db.String(20), default='active', nullable=False) # 'active', 'revoked'
    venue_details = db.Column(db.String(150), default="Block C, Exam Center")

    def to_dict(self):
        return {
            'id': self.id,
            'student_id': self.student_id,
            'student_name': self.student.user.full_name if self.student and self.student.user else None,
            'college_id': self.student.college_id if self.student else None,
            'department_name': self.student.department.name if self.student and self.student.department else None,
            'exam_name': self.exam_name,
            'ticket_number': self.ticket_number,
            'issued_date': self.issued_date.isoformat() if self.issued_date else None,
            'status': self.status,
            'venue_details': self.venue_details,
            'verification_hash': self.verification_hash
        }
