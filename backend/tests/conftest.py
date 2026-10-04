import os
import sys
import pytest

# Add backend directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import create_app
from app.extensions import db
from app.models.institution import Institution, Department, AcademicYear, ClassRoom
from app.models.user import Role, User, UserRole
from app.models.academic import Student, Enrollment, TeacherAssignment
from app.models.privacy import PrivacyNotice
from app.security.argon2_hasher import hash_password

@pytest.fixture
def app():
    """Create and configure a fresh Flask app instance for each test suite."""
    app = create_app('testing')
    with app.app_context():
        db.create_all()
        _seed_test_base_data()
        yield app
        db.session.remove()
        db.drop_all()

@pytest.fixture
def client(app):
    """A test client for the app."""
    return app.test_client()

def _seed_test_base_data():
    """Seed minimum base data for tests."""
    roles = [
        ('super_admin', 'Super College Admin', 'Institutional management'),
        ('academic_admin', 'Academic Department Admin', 'Department administration'),
        ('exam_admin', 'Exam Department Admin', 'Examinations'),
        ('placement_admin', 'Placement Department Admin', 'Placements'),
        ('teacher', 'Class Teacher', 'Class instruction'),
        ('student', 'Student', 'Student access')
    ]
    for name, disp, desc in roles:
        r = Role(name=name, display_name=disp, description=desc)
        db.session.add(r)

    inst = Institution(
        name="Test Institute of Technology",
        code="TIT",
        domain="college.edu",
        contact_email="admin@college.edu"
    )
    db.session.add(inst)
    db.session.commit()

    ay = AcademicYear(
        institution_id=inst.id,
        year_name="2026-2027",
        start_date=db.func.current_date(),
        end_date=db.func.current_date(),
        is_current=True
    )
    db.session.add(ay)

    pn = PrivacyNotice(
        institution_id=inst.id,
        version="1.0",
        title="Test Privacy Notice",
        purpose="Educational testing",
        data_categories_collected=["Identity", "Academic"],
        retention_period="5 years",
        effective_date=db.func.current_date(),
        is_active=True
    )
    db.session.add(pn)

    # Departments
    comp = Department(institution_id=inst.id, name="Computer Engineering", code="COMP", type="academic")
    it = Department(institution_id=inst.id, name="Information Technology", code="IT", type="academic")
    db.session.add_all([comp, it])
    db.session.commit()
