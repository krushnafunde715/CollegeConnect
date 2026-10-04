from datetime import datetime, date
from app.extensions import db

class Student(db.Model):
    __tablename__ = 'students'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), unique=True, nullable=False)
    college_id = db.Column(db.String(50), unique=True, nullable=False, index=True) # PRN/Roll Number - separate identifier, NOT login
    department_id = db.Column(db.Integer, db.ForeignKey('departments.id', ondelete='RESTRICT'), nullable=False)
    current_class_id = db.Column(db.Integer, db.ForeignKey('classes.id', ondelete='SET NULL'), nullable=True)
    admission_year = db.Column(db.Integer, nullable=False)
    date_of_birth = db.Column(db.Date, nullable=True) # Private PII
    blood_group = db.Column(db.String(10), nullable=True)
    guardian_name = db.Column(db.String(150), nullable=True)
    guardian_contact = db.Column(db.String(50), nullable=True) # Masked when exposed
    address = db.Column(db.Text, nullable=True) # Private PII
    cgpa = db.Column(db.Float, default=0.0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    enrollments = db.relationship('Enrollment', backref='student', lazy=True, cascade="all, delete-orphan")
    academic_records = db.relationship('AcademicRecord', backref='student', lazy=True, cascade="all, delete-orphan")
    attendances = db.relationship('Attendance', backref='student', lazy=True, cascade="all, delete-orphan")
    exam_registrations = db.relationship('ExamRegistration', backref='student', lazy=True, cascade="all, delete-orphan")
    results = db.relationship('Result', backref='student', lazy=True, cascade="all, delete-orphan")
    hall_tickets = db.relationship('HallTicket', backref='student', lazy=True, cascade="all, delete-orphan")
    job_applications = db.relationship('Application', backref='student', lazy=True, cascade="all, delete-orphan")
    offers = db.relationship('Offer', backref='student', lazy=True, cascade="all, delete-orphan")
    privacy_requests = db.relationship('PrivacyRequest', backref='student', lazy=True, cascade="all, delete-orphan")
    correction_requests = db.relationship('CorrectionRequest', backref='student', lazy=True, cascade="all, delete-orphan")

    def to_dict(self, include_pii=False, for_teacher=False):
        """
        DPDP-inspired data minimisation:
        - Include full PII only when student views own profile or with explicit authorization
        - Teachers see academic info and masked guardian contact
        - Public / minimal view omits private contact/address
        """
        data = {
            'id': self.id,
            'user_id': self.user_id,
            'college_id': self.college_id,
            'full_name': self.user.full_name if self.user else None,
            'email': self.user.email if self.user else None,
            'account_status': self.user.account_status if self.user else None,
            'department_id': self.department_id,
            'department_name': self.department.name if self.department else None,
            'department_code': self.department.code if self.department else None,
            'current_class_id': self.current_class_id,
            'current_class_name': self.current_class.name if self.current_class else None,
            'admission_year': self.admission_year,
            'cgpa': self.cgpa,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

        if include_pii:
            data['date_of_birth'] = self.date_of_birth.isoformat() if self.date_of_birth else None
            data['blood_group'] = self.blood_group
            data['guardian_name'] = self.guardian_name
            data['guardian_contact'] = self.guardian_contact
            data['address'] = self.address
            data['phone_masked'] = self.user.phone_masked if self.user else None
        elif for_teacher:
            data['date_of_birth'] = None # Minimised
            data['blood_group'] = self.blood_group
            data['guardian_name'] = self.guardian_name
            # Mask phone for privacy
            if self.guardian_contact and len(self.guardian_contact) >= 4:
                data['guardian_contact'] = self.guardian_contact[:3] + '****' + self.guardian_contact[-2:]
            else:
                data['guardian_contact'] = None

        return data


class Enrollment(db.Model):
    __tablename__ = 'enrollments'

    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('students.id', ondelete='CASCADE'), nullable=False)
    class_id = db.Column(db.Integer, db.ForeignKey('classes.id', ondelete='CASCADE'), nullable=False)
    academic_year_id = db.Column(db.Integer, db.ForeignKey('academic_years.id', ondelete='CASCADE'), nullable=False)
    enrollment_status = db.Column(db.String(30), default='enrolled', nullable=False) # 'enrolled', 'completed', 'transferred', 'dropped'
    enrolled_at = db.Column(db.DateTime, default=datetime.utcnow)

    __table_args__ = (
        db.UniqueConstraint('student_id', 'class_id', 'academic_year_id', name='uq_student_class_year'),
    )

    def to_dict(self):
        return {
            'id': self.id,
            'student_id': self.student_id,
            'class_id': self.class_id,
            'class_name': self.classroom.name if self.classroom else None,
            'academic_year_id': self.academic_year_id,
            'academic_year_name': self.academic_year.year_name if self.academic_year else None,
            'enrollment_status': self.enrollment_status,
            'enrolled_at': self.enrolled_at.isoformat() if self.enrolled_at else None
        }


class TeacherAssignment(db.Model):
    __tablename__ = 'teacher_assignments'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    department_id = db.Column(db.Integer, db.ForeignKey('departments.id', ondelete='CASCADE'), nullable=False)
    class_id = db.Column(db.Integer, db.ForeignKey('classes.id', ondelete='CASCADE'), nullable=False)
    subject_name = db.Column(db.String(100), nullable=False) # e.g. "Data Structures", "Database Management Systems"
    is_class_teacher = db.Column(db.Boolean, default=False, nullable=False)
    assigned_at = db.Column(db.DateTime, default=datetime.utcnow)

    __table_args__ = (
        db.UniqueConstraint('user_id', 'class_id', 'subject_name', name='uq_teacher_class_subject'),
    )

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'teacher_name': self.user.full_name if self.user else None,
            'teacher_email': self.user.email if self.user else None,
            'department_id': self.department_id,
            'department_name': self.department.name if self.department else None,
            'class_id': self.class_id,
            'class_name': self.classroom.name if self.classroom else None,
            'subject_name': self.subject_name,
            'is_class_teacher': self.is_class_teacher,
            'assigned_at': self.assigned_at.isoformat() if self.assigned_at else None
        }


class AcademicRecord(db.Model):
    __tablename__ = 'academic_records'

    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('students.id', ondelete='CASCADE'), nullable=False)
    class_id = db.Column(db.Integer, db.ForeignKey('classes.id', ondelete='CASCADE'), nullable=False)
    semester = db.Column(db.String(20), nullable=False) # e.g. "Semester 3"
    subject_code = db.Column(db.String(20), nullable=False) # e.g. "CS301"
    subject_name = db.Column(db.String(100), nullable=False)
    internal_marks = db.Column(db.Float, nullable=False, default=0.0) # Out of 30 or 25
    external_marks = db.Column(db.Float, nullable=False, default=0.0) # Out of 70 or 75
    total_marks = db.Column(db.Float, nullable=False, default=0.0)
    grade = db.Column(db.String(5), nullable=False, default='A')
    credits = db.Column(db.Float, nullable=False, default=4.0)
    status = db.Column(db.String(20), nullable=False, default='pass') # 'pass', 'fail'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'student_id': self.student_id,
            'class_id': self.class_id,
            'class_name': self.student.current_class.name if self.student and self.student.current_class else None,
            'semester': self.semester,
            'subject_code': self.subject_code,
            'subject_name': self.subject_name,
            'internal_marks': self.internal_marks,
            'external_marks': self.external_marks,
            'total_marks': self.total_marks,
            'grade': self.grade,
            'credits': self.credits,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class Attendance(db.Model):
    __tablename__ = 'attendances'

    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('students.id', ondelete='CASCADE'), nullable=False)
    class_id = db.Column(db.Integer, db.ForeignKey('classes.id', ondelete='CASCADE'), nullable=False)
    date = db.Column(db.Date, nullable=False)
    subject_name = db.Column(db.String(100), nullable=False)
    status = db.Column(db.String(20), nullable=False, default='present') # 'present', 'absent', 'late', 'excused'
    recorded_by_user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='SET NULL'), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    __table_args__ = (
        db.UniqueConstraint('student_id', 'class_id', 'date', 'subject_name', name='uq_attendance_student_date_subj'),
    )

    def to_dict(self):
        return {
            'id': self.id,
            'student_id': self.student_id,
            'student_name': self.student.user.full_name if self.student and self.student.user else None,
            'college_id': self.student.college_id if self.student else None,
            'class_id': self.class_id,
            'date': self.date.isoformat() if self.date else None,
            'subject_name': self.subject_name,
            'status': self.status,
            'recorded_by_user_id': self.recorded_by_user_id,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
