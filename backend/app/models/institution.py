from datetime import datetime
from app.extensions import db

class Institution(db.Model):
    __tablename__ = 'institutions'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    code = db.Column(db.String(50), unique=True, nullable=False)
    domain = db.Column(db.String(255), nullable=False)
    address = db.Column(db.Text, nullable=True)
    contact_email = db.Column(db.String(255), nullable=True)
    settings = db.Column(db.JSON, default=dict)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    departments = db.relationship('Department', backref='institution', lazy=True, cascade="all, delete-orphan")
    academic_years = db.relationship('AcademicYear', backref='institution', lazy=True, cascade="all, delete-orphan")
    users = db.relationship('User', backref='institution', lazy=True)
    privacy_notices = db.relationship('PrivacyNotice', backref='institution', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'code': self.code,
            'domain': self.domain,
            'address': self.address,
            'contact_email': self.contact_email,
            'settings': self.settings or {},
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class Department(db.Model):
    __tablename__ = 'departments'

    id = db.Column(db.Integer, primary_key=True)
    institution_id = db.Column(db.Integer, db.ForeignKey('institutions.id', ondelete='CASCADE'), nullable=False)
    name = db.Column(db.String(150), nullable=False)
    code = db.Column(db.String(30), nullable=False)
    type = db.Column(db.String(50), nullable=False, default='academic') # 'academic', 'exam', 'placement', 'administrative'
    description = db.Column(db.Text, nullable=True)
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    classes = db.relationship('ClassRoom', backref='department', lazy=True, cascade="all, delete-orphan")
    students = db.relationship('Student', backref='department', lazy=True)
    user_roles = db.relationship('UserRole', backref='department', lazy=True)
    teacher_assignments = db.relationship('TeacherAssignment', backref='department', lazy=True)
    exam_schedules = db.relationship('ExamSchedule', backref='department', lazy=True)

    __table_args__ = (
        db.UniqueConstraint('institution_id', 'code', name='uq_department_institution_code'),
    )

    def to_dict(self):
        return {
            'id': self.id,
            'institution_id': self.institution_id,
            'name': self.name,
            'code': self.code,
            'type': self.type,
            'description': self.description,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class AcademicYear(db.Model):
    __tablename__ = 'academic_years'

    id = db.Column(db.Integer, primary_key=True)
    institution_id = db.Column(db.Integer, db.ForeignKey('institutions.id', ondelete='CASCADE'), nullable=False)
    year_name = db.Column(db.String(50), nullable=False) # e.g. "2026-2027"
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=False)
    is_current = db.Column(db.Boolean, default=False, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    classes = db.relationship('ClassRoom', backref='academic_year', lazy=True)
    enrollments = db.relationship('Enrollment', backref='academic_year', lazy=True)

    __table_args__ = (
        db.UniqueConstraint('institution_id', 'year_name', name='uq_academic_year_institution'),
    )

    def to_dict(self):
        return {
            'id': self.id,
            'institution_id': self.institution_id,
            'year_name': self.year_name,
            'start_date': self.start_date.isoformat() if self.start_date else None,
            'end_date': self.end_date.isoformat() if self.end_date else None,
            'is_current': self.is_current,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class ClassRoom(db.Model):
    __tablename__ = 'classes'

    id = db.Column(db.Integer, primary_key=True)
    department_id = db.Column(db.Integer, db.ForeignKey('departments.id', ondelete='CASCADE'), nullable=False)
    academic_year_id = db.Column(db.Integer, db.ForeignKey('academic_years.id', ondelete='CASCADE'), nullable=False)
    name = db.Column(db.String(50), nullable=False) # e.g. "SE A", "TE B", "BE A"
    year_level = db.Column(db.String(20), nullable=False) # "FE", "SE", "TE", "BE"
    division = db.Column(db.String(10), nullable=False) # "A", "B", "C"
    capacity = db.Column(db.Integer, default=70)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    current_students = db.relationship('Student', backref='current_class', lazy=True, foreign_keys='Student.current_class_id')
    enrollments = db.relationship('Enrollment', backref='classroom', lazy=True, cascade="all, delete-orphan")
    teacher_assignments = db.relationship('TeacherAssignment', backref='classroom', lazy=True, cascade="all, delete-orphan")
    attendances = db.relationship('Attendance', backref='classroom', lazy=True)

    __table_args__ = (
        db.UniqueConstraint('department_id', 'academic_year_id', 'name', name='uq_class_dept_year_name'),
    )

    def to_dict(self):
        return {
            'id': self.id,
            'department_id': self.department_id,
            'department_name': self.department.name if self.department else None,
            'department_code': self.department.code if self.department else None,
            'academic_year_id': self.academic_year_id,
            'academic_year_name': self.academic_year.year_name if self.academic_year else None,
            'name': self.name,
            'year_level': self.year_level,
            'division': self.division,
            'capacity': self.capacity,
            'student_count': len(self.current_students) if self.current_students else 0,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
