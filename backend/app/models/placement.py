from datetime import datetime
from app.extensions import db

class Company(db.Model):
    __tablename__ = 'companies'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), unique=True, nullable=False)
    industry = db.Column(db.String(100), nullable=False)
    website = db.Column(db.String(255), nullable=True)
    contact_email = db.Column(db.String(255), nullable=True)
    description = db.Column(db.Text, nullable=True)
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    drives = db.relationship('PlacementDrive', backref='company', lazy=True, cascade="all, delete-orphan")

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'industry': self.industry,
            'website': self.website,
            'contact_email': self.contact_email,
            'description': self.description,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class PlacementDrive(db.Model):
    __tablename__ = 'placement_drives'

    id = db.Column(db.Integer, primary_key=True)
    company_id = db.Column(db.Integer, db.ForeignKey('companies.id', ondelete='CASCADE'), nullable=False)
    title = db.Column(db.String(150), nullable=False) # e.g. "Software Engineer - Campus Recruitment 2026"
    role_description = db.Column(db.Text, nullable=True)
    eligible_departments = db.Column(db.String(255), default="All") # e.g. "COMP,IT,ENTC"
    min_cgpa = db.Column(db.Float, default=6.5)
    package_details = db.Column(db.String(100), nullable=False) # e.g. "12.5 LPA"
    drive_date = db.Column(db.Date, nullable=False)
    registration_deadline = db.Column(db.Date, nullable=False)
    location = db.Column(db.String(100), default="On-Campus / Virtual")
    status = db.Column(db.String(30), default='open', nullable=False) # 'open', 'in_progress', 'completed', 'cancelled'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    applications = db.relationship('Application', backref='drive', lazy=True, cascade="all, delete-orphan")
    offers = db.relationship('Offer', backref='drive', lazy=True, cascade="all, delete-orphan")

    def to_dict(self):
        return {
            'id': self.id,
            'company_id': self.company_id,
            'company_name': self.company.name if self.company else None,
            'company_industry': self.company.industry if self.company else None,
            'title': self.title,
            'role_description': self.role_description,
            'eligible_departments': self.eligible_departments,
            'min_cgpa': self.min_cgpa,
            'package_details': self.package_details,
            'drive_date': self.drive_date.isoformat() if self.drive_date else None,
            'registration_deadline': self.registration_deadline.isoformat() if self.registration_deadline else None,
            'location': self.location,
            'status': self.status,
            'application_count': len(self.applications) if self.applications else 0,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class Application(db.Model):
    __tablename__ = 'placement_applications'

    id = db.Column(db.Integer, primary_key=True)
    placement_drive_id = db.Column(db.Integer, db.ForeignKey('placement_drives.id', ondelete='CASCADE'), nullable=False)
    student_id = db.Column(db.Integer, db.ForeignKey('students.id', ondelete='CASCADE'), nullable=False)
    status = db.Column(db.String(30), default='applied', nullable=False) # 'applied', 'shortlisted', 'interviewing', 'selected', 'rejected'
    resume_url = db.Column(db.String(255), nullable=True)
    applied_at = db.Column(db.DateTime, default=datetime.utcnow)
    notes = db.Column(db.Text, nullable=True)

    __table_args__ = (
        db.UniqueConstraint('placement_drive_id', 'student_id', name='uq_placement_app_drive_student'),
    )

    # Relationships
    offers = db.relationship('Offer', backref='application', lazy=True, cascade="all, delete-orphan")

    def to_dict(self):
        return {
            'id': self.id,
            'placement_drive_id': self.placement_drive_id,
            'drive_title': self.drive.title if self.drive else None,
            'company_name': self.drive.company.name if self.drive and self.drive.company else None,
            'student_id': self.student_id,
            'student_name': self.student.user.full_name if self.student and self.student.user else None,
            'college_id': self.student.college_id if self.student else None,
            'student_cgpa': self.student.cgpa if self.student else None,
            'department_name': self.student.department.name if self.student and self.student.department else None,
            'status': self.status,
            'resume_url': self.resume_url,
            'applied_at': self.applied_at.isoformat() if self.applied_at else None,
            'notes': self.notes
        }


class Offer(db.Model):
    __tablename__ = 'placement_offers'

    id = db.Column(db.Integer, primary_key=True)
    application_id = db.Column(db.Integer, db.ForeignKey('placement_applications.id', ondelete='CASCADE'), nullable=False)
    student_id = db.Column(db.Integer, db.ForeignKey('students.id', ondelete='CASCADE'), nullable=False)
    placement_drive_id = db.Column(db.Integer, db.ForeignKey('placement_drives.id', ondelete='CASCADE'), nullable=False)
    designation = db.Column(db.String(100), nullable=False)
    ctc = db.Column(db.String(50), nullable=False) # e.g. "14 LPA"
    offer_date = db.Column(db.Date, default=datetime.utcnow)
    status = db.Column(db.String(30), default='offered', nullable=False) # 'offered', 'accepted', 'declined'
    joining_date = db.Column(db.Date, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'application_id': self.application_id,
            'student_id': self.student_id,
            'student_name': self.student.user.full_name if self.student and self.student.user else None,
            'college_id': self.student.college_id if self.student else None,
            'company_name': self.drive.company.name if self.drive and self.drive.company else None,
            'placement_drive_id': self.placement_drive_id,
            'designation': self.designation,
            'ctc': self.ctc,
            'offer_date': self.offer_date.isoformat() if self.offer_date else None,
            'status': self.status,
            'joining_date': self.joining_date.isoformat() if self.joining_date else None
        }
