import os
from datetime import datetime, date, timedelta
from app import create_app
from app.extensions import db
from app.models.institution import Institution, Department, AcademicYear, ClassRoom
from app.models.user import Role, User, UserRole
from app.models.academic import Student, Enrollment, TeacherAssignment, AcademicRecord, Attendance
from app.models.examination import ExamSchedule, ExamRegistration, Result, HallTicket
from app.models.placement import Company, PlacementDrive, Application, Offer
from app.models.privacy import PrivacyNotice, ConsentRecord, PrivacyRequest, CorrectionRequest, AuditLog
from app.security.argon2_hasher import hash_password

def seed_database():
    app = create_app('development')
    with app.app_context():
        print("Creating database schema...")
        db.create_all()

        # Check if already seeded
        if Role.query.first():
            print("Database already contains data. Skipping re-seed.")
            return

        print("Seeding Institutional Roles...")
        roles_data = [
            ('super_admin', 'Super College Admin', 'Institutional management and department admin provisioning'),
            ('academic_admin', 'Academic Department Admin', 'Manages classes, students, and faculty assignments within department'),
            ('exam_admin', 'Exam Department Admin', 'Manages schedules, hall tickets, and results'),
            ('placement_admin', 'Placement Department Admin', 'Manages company drives, applications, and placement offers'),
            ('teacher', 'Class Teacher / Faculty', 'Manages assigned class attendance, academic records, and student progress'),
            ('student', 'Student', 'Views own academic records, privacy requests, exams, and placement drives')
        ]
        roles = {}
        for code, display, desc in roles_data:
            r = Role(name=code, display_name=display, description=desc)
            db.session.add(r)
            roles[code] = r
        db.session.commit()

        print("Seeding Institution...")
        institution = Institution(
            name="CollegeConnect Institute of Technology",
            code="CCIT",
            domain="college.edu",
            address="Campus Boulevard, Innovation Park",
            contact_email="contact@college.edu",
            settings={
                "privacy_framework": "DPDP-2026-Aligned",
                "academic_cycle": "Semester",
                "data_protection_officer": "dpo@college.edu"
            }
        )
        db.session.add(institution)
        db.session.commit()

        print("Seeding Academic Year...")
        academic_year = AcademicYear(
            institution_id=institution.id,
            year_name="2026-2027",
            start_date=date(2026, 7, 1),
            end_date=date(2027, 6, 30),
            is_current=True
        )
        db.session.add(academic_year)
        db.session.commit()

        print("Seeding Privacy Notice...")
        privacy_notice = PrivacyNotice(
            institution_id=institution.id,
            version="2026.1",
            title="Institutional Student Data Privacy Notice",
            purpose="Processing of student demographic, attendance, academic, examination, and placement records for lawful educational administration and institutional record-keeping.",
            data_categories_collected=["Identity Data", "Academic Records", "Contact Info (Masked)", "Examination Performance", "Placement Eligibility"],
            retention_period="Duration of active enrollment plus 5 years statutory audit compliance period",
            effective_date=date(2026, 1, 1),
            is_active=True
        )
        db.session.add(privacy_notice)
        db.session.commit()

        print("Seeding Departments...")
        comp_dept = Department(
            institution_id=institution.id,
            name="Computer Engineering",
            code="COMP",
            type="academic",
            description="Department of Computer Science & Engineering"
        )
        it_dept = Department(
            institution_id=institution.id,
            name="Information Technology",
            code="IT",
            type="academic",
            description="Department of Information Technology"
        )
        entc_dept = Department(
            institution_id=institution.id,
            name="Electronics & Telecommunication",
            code="ENTC",
            type="academic",
            description="Department of Electronics & Telecom"
        )
        exam_dept = Department(
            institution_id=institution.id,
            name="Examination Cell",
            code="EXAM",
            type="exam",
            description="Central Examination Administration"
        )
        placement_dept = Department(
            institution_id=institution.id,
            name="Training & Placement Cell",
            code="TPO",
            type="placement",
            description="Corporate Relations and Career Services"
        )
        db.session.add_all([comp_dept, it_dept, entc_dept, exam_dept, placement_dept])
        db.session.commit()

        print("Seeding Super Admin...")
        super_admin_user = User(
            institution_id=institution.id,
            email="superadmin@college.edu",
            password_hash=hash_password("SuperAdmin@2026!"),
            full_name="Kartik Bhegade",
            account_status="active",
            phone_masked="+91 99****0001"
        )
        db.session.add(super_admin_user)
        db.session.commit()
        db.session.add(UserRole(user_id=super_admin_user.id, role_id=roles['super_admin'].id, department_id=None))
        db.session.commit()

        print("Seeding Department Admins...")
        # COMP Academic Admin
        comp_admin_user = User(
            institution_id=institution.id,
            email="comp.admin@college.edu",
            password_hash=hash_password("Admin@COMP2026!"),
            full_name="Prof. Kirti Borhade",
            account_status="active",
            phone_masked="+91 98****1101"
        )
        db.session.add(comp_admin_user)
        db.session.commit()
        db.session.add(UserRole(user_id=comp_admin_user.id, role_id=roles['academic_admin'].id, department_id=comp_dept.id))

        # IT Academic Admin
        it_admin_user = User(
            institution_id=institution.id,
            email="it.admin@college.edu",
            password_hash=hash_password("Admin@IT2026!"),
            full_name="Prof. Sarah Jenkins",
            account_status="active",
            phone_masked="+91 98****1102"
        )
        db.session.add(it_admin_user)
        db.session.commit()
        db.session.add(UserRole(user_id=it_admin_user.id, role_id=roles['academic_admin'].id, department_id=it_dept.id))

        # Exam Admin
        exam_admin_user = User(
            institution_id=institution.id,
            email="exam.admin@college.edu",
            password_hash=hash_password("Admin@EXAM2026!"),
            full_name="Prof. Akash Mhetre",
            account_status="active",
            phone_masked="+91 98****1103"
        )
        db.session.add(exam_admin_user)
        db.session.commit()
        db.session.add(UserRole(user_id=exam_admin_user.id, role_id=roles['exam_admin'].id, department_id=exam_dept.id))

        # Placement Admin
        placement_admin_user = User(
            institution_id=institution.id,
            email="placement.admin@college.edu",
            password_hash=hash_password("Admin@TPO2026!"),
            full_name="Prof. Satyajit Sirsat",
            account_status="active",
            phone_masked="+91 98****1104"
        )
        db.session.add(placement_admin_user)
        db.session.commit()
        db.session.add(UserRole(user_id=placement_admin_user.id, role_id=roles['placement_admin'].id, department_id=placement_dept.id))

        print("Seeding Classes for Computer Engineering...")
        class_se_a = ClassRoom(department_id=comp_dept.id, academic_year_id=academic_year.id, name="SE A", year_level="SE", division="A", capacity=70)
        class_se_b = ClassRoom(department_id=comp_dept.id, academic_year_id=academic_year.id, name="SE B", year_level="SE", division="B", capacity=70)
        class_te_a = ClassRoom(department_id=comp_dept.id, academic_year_id=academic_year.id, name="TE A", year_level="TE", division="A", capacity=70)
        class_be_a = ClassRoom(department_id=comp_dept.id, academic_year_id=academic_year.id, name="BE A", year_level="BE", division="A", capacity=70)
        db.session.add_all([class_se_a, class_se_b, class_te_a, class_be_a])
        db.session.commit()

        print("Seeding Faculty & Class Teacher Assignments...")
        teacher_user = User(
            institution_id=institution.id,
            email="teacher.hayes@college.edu",
            password_hash=hash_password("Teacher@2026!"),
            full_name="Prof. Sonal Kadam",
            account_status="active",
            phone_masked="+91 97****5522"
        )
        db.session.add(teacher_user)
        db.session.commit()
        db.session.add(UserRole(user_id=teacher_user.id, role_id=roles['teacher'].id, department_id=comp_dept.id))

        # Assign as Class Teacher for SE A with Data Structures subject
        assignment = TeacherAssignment(
            user_id=teacher_user.id,
            department_id=comp_dept.id,
            class_id=class_se_a.id,
            subject_name="Data Structures & Algorithms",
            is_class_teacher=True
        )
        db.session.add(assignment)
        db.session.commit()

        print("Seeding Students...")
        students_data = [
            ("alice.sharma@college.edu", "Krushna Funde", "CC-2026-COMP-001", class_se_a.id, 8.85, date(2005, 3, 15), "+91 9876543210", "Talegaon, Pune, Maharashtra", "B+"),
            ("bob.miller@college.edu", "Bob Miller", "CC-2026-COMP-002", class_se_a.id, 7.90, date(2005, 7, 22), "+91 9876543211", "12 Maple Crescent", "O+"),
            ("charlie.davis@college.edu", "Charlie Davis", "CC-2026-COMP-003", class_se_b.id, 9.15, date(2004, 11, 8), "+91 9876543212", "78 Hilltop Road", "A+")
        ]

        seeded_students = []
        for email, full_name, college_id, class_id, cgpa, dob, guardian_contact, address, blood in students_data:
            s_user = User(
                institution_id=institution.id,
                email=email,
                password_hash=hash_password("Student@2026!"),
                full_name=full_name,
                account_status="active",
                phone_masked="+91 98****" + college_id[-4:]
            )
            db.session.add(s_user)
            db.session.commit()

            db.session.add(UserRole(user_id=s_user.id, role_id=roles['student'].id, department_id=comp_dept.id))

            student = Student(
                user_id=s_user.id,
                college_id=college_id,
                department_id=comp_dept.id,
                current_class_id=class_id,
                admission_year=2025,
                date_of_birth=dob,
                blood_group=blood,
                guardian_name=f"Parent of {full_name.split()[0]}",
                guardian_contact=guardian_contact,
                address=address,
                cgpa=cgpa
            )
            db.session.add(student)
            db.session.commit()

            db.session.add(Enrollment(
                student_id=student.id,
                class_id=class_id,
                academic_year_id=academic_year.id,
                enrollment_status="enrolled"
            ))

            db.session.add(ConsentRecord(
                user_id=s_user.id,
                privacy_notice_id=privacy_notice.id,
                consent_type="academic_processing",
                granted=True,
                ip_address="127.0.0.1"
            ))

            seeded_students.append(student)

        db.session.commit()

        print("Seeding Academic Records & Attendance...")
        alice = seeded_students[0]
        # Academic Records
        subjects = [
            ("CS301", "Data Structures & Algorithms", 28.0, 64.0, 92.0, "O", 4.0),
            ("CS302", "Database Management Systems", 26.0, 58.0, 84.0, "A+", 4.0),
            ("CS303", "Computer Networks", 25.0, 55.0, 80.0, "A", 3.0),
            ("CS304", "Discrete Mathematics", 27.0, 60.0, 87.0, "A+", 4.0)
        ]
        for code, name, internal, external, total, grade, credits in subjects:
            db.session.add(AcademicRecord(
                student_id=alice.id,
                class_id=class_se_a.id,
                semester="Semester 3",
                subject_code=code,
                subject_name=name,
                internal_marks=internal,
                external_marks=external,
                total_marks=total,
                grade=grade,
                credits=credits,
                status="pass"
            ))

        # Attendance for past 10 days
        for i in range(10):
            att_date = date.today() - timedelta(days=i)
            if att_date.weekday() < 5: # Weekdays
                db.session.add(Attendance(
                    student_id=alice.id,
                    class_id=class_se_a.id,
                    date=att_date,
                    subject_name="Data Structures & Algorithms",
                    status="present" if i != 3 else "absent",
                    recorded_by_user_id=teacher_user.id
                ))

        print("Seeding Examination Timetables & Results...")
        exam_sched = ExamSchedule(
            department_id=comp_dept.id,
            academic_year_id=academic_year.id,
            exam_name="End Semester Examination - Winter 2026",
            semester="Semester 3",
            subject_code="CS301",
            subject_name="Data Structures & Algorithms",
            exam_date=date.today() + timedelta(days=14),
            start_time="10:00 AM",
            end_time="01:00 PM",
            venue="Exam Block C, Hall 102",
            total_marks=100
        )
        db.session.add(exam_sched)
        db.session.commit()

        db.session.add(ExamRegistration(
            student_id=alice.id,
            exam_schedule_id=exam_sched.id,
            status="approved"
        ))

        db.session.add(HallTicket(
            student_id=alice.id,
            exam_name="End Semester Examination - Winter 2026",
            ticket_number="HT-CCIT-2026-COMP-001",
            verification_hash="e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
            venue_details="Exam Block C, Desk 14",
            status="active"
        ))

        db.session.add(Result(
            student_id=alice.id,
            semester="Semester 2",
            exam_name="Summer 2026 University Exam",
            sgpa=8.85,
            cgpa=8.85,
            total_credits=24.0,
            status="pass",
            published_date=date(2026, 6, 15),
            remarks="Passed with First Class Distinction"
        ))

        print("Seeding Placement Drives & Companies...")
        comp_google = Company(
            name="Google Cloud Technologies",
            industry="Cloud Computing & Software",
            website="https://careers.google.com",
            contact_email="university-recruiting@google.com",
            description="Global technology leader in cloud and distributed systems"
        )
        comp_ms = Company(
            name="Microsoft IDC",
            industry="Software Engineering & AI",
            website="https://careers.microsoft.com",
            contact_email="campus-india@microsoft.com",
            description="Innovating cloud, OS, and generative AI platforms"
        )
        db.session.add_all([comp_google, comp_ms])
        db.session.commit()

        drive_google = PlacementDrive(
            company_id=comp_google.id,
            title="Software Development Engineer - 2026 Campus Drive",
            role_description="Core backend development, API infrastructure, distributed systems in Go/Python/C++",
            eligible_departments="COMP,IT",
            min_cgpa=7.5,
            package_details="18.5 LPA + Performance Bonuses",
            drive_date=date.today() + timedelta(days=21),
            registration_deadline=date.today() + timedelta(days=7),
            location="Auditorium Hall 1 & Online Assessment",
            status="open"
        )
        db.session.add(drive_google)
        db.session.commit()

        app_alice = Application(
            placement_drive_id=drive_google.id,
            student_id=alice.id,
            status="applied",
            resume_url="https://college.edu/resumes/alice_sharma.pdf"
        )
        db.session.add(app_alice)

        print("Seeding Student Data Correction Request (DPDP Right to Correction)...")
        corr_req = CorrectionRequest(
            student_id=alice.id,
            field_name="phone_masked",
            current_value="+91 98****0001",
            requested_value="+91 98****4321",
            justification="Updated institutional contact number following telecom migration.",
            status="pending"
        )
        db.session.add(corr_req)

        print("Seeding Initial Audit Logs...")
        db.session.add(AuditLog(
            institution_id=institution.id,
            user_id=super_admin_user.id,
            action="SYSTEM_INITIALIZED",
            resource_type="system",
            resource_id="0",
            status="success",
            details={"message": "CollegeConnect system successfully provisioned."}
        ))

        db.session.commit()
        print("\nSeed completed successfully!")
        print("Demo Credentials (all using registered institutional email + password):")
        print("  Super Admin:      superadmin@college.edu      / SuperAdmin@2026!")
        print("  COMP Dept Admin:  comp.admin@college.edu      / Admin@COMP2026!")
        print("  IT Dept Admin:    it.admin@college.edu        / Admin@IT2026!")
        print("  Exam Admin:       exam.admin@college.edu      / Admin@EXAM2026!")
        print("  Placement Admin:  placement.admin@college.edu / Admin@TPO2026!")
        print("  Class Teacher:    teacher.hayes@college.edu   / Teacher@2026!")
        print("  Student:          alice.sharma@college.edu    / Student@2026!")

if __name__ == '__main__':
    seed_database()
