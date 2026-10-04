from datetime import datetime, date
from flask import Blueprint, request, jsonify, g
from app.extensions import db
from app.security.decorators import roles_required, student_ownership_required
from app.security.audit import log_audit
from app.models.academic import Student, AcademicRecord, Attendance, Enrollment
from app.models.examination import ExamSchedule, ExamRegistration, Result, HallTicket
from app.models.placement import PlacementDrive, Application, Offer
from app.models.privacy import PrivacyNotice, ConsentRecord, PrivacyRequest, CorrectionRequest, AuditLog

student_bp = Blueprint('student', __name__, url_prefix='/api/student')

@student_bp.route('/profile', methods=['GET'])
@roles_required('student')
def get_my_profile():
    """Retrieve the authenticated student's full profile including protected PII."""
    student = g.current_user.student_profile
    if not student:
        return jsonify({'status': 'error', 'message': 'Student profile not found.'}), 404

    log_audit(
        action='VIEW_OWN_PROFILE',
        resource_type='student',
        resource_id=str(student.id),
        department_id=student.department_id,
        user_id=g.current_user.id
    )

    return jsonify({
        'status': 'success',
        'data': student.to_dict(include_pii=True)
    })

@student_bp.route('/dashboard', methods=['GET'])
@roles_required('student')
def get_student_dashboard():
    """Student dashboard overview metrics, requests, and announcements."""
    student = g.current_user.student_profile
    if not student:
        return jsonify({'status': 'error', 'message': 'Student profile not found.'}), 404

    # Calculate attendance statistics
    total_attendance = Attendance.query.filter_by(student_id=student.id).count()
    present_count = Attendance.query.filter_by(student_id=student.id, status='present').count()
    attendance_pct = round((present_count / total_attendance * 100), 1) if total_attendance > 0 else 100.0

    # Recent academic records
    records = AcademicRecord.query.filter_by(student_id=student.id).all()
    
    # Active requests
    pending_corrections = CorrectionRequest.query.filter_by(student_id=student.id).count()
    pending_privacy_reqs = PrivacyRequest.query.filter_by(student_id=student.id).count()

    # Active placement applications
    apps_count = Application.query.filter_by(student_id=student.id).count()
    offers_count = Offer.query.filter_by(student_id=student.id).count()

    # Recent Audit activity for the student
    recent_activity = AuditLog.query.filter_by(user_id=g.current_user.id).order_by(AuditLog.timestamp.desc()).limit(5).all()

    return jsonify({
        'status': 'success',
        'data': {
            'student_info': student.to_dict(include_pii=False),
            'attendance_percentage': attendance_pct,
            'total_classes_attended': present_count,
            'total_classes_conducted': total_attendance,
            'cgpa': student.cgpa,
            'subject_count': len(records),
            'pending_requests_count': pending_corrections + pending_privacy_reqs,
            'applications_count': apps_count,
            'offers_count': offers_count,
            'recent_activity': [a.to_dict() for a in recent_activity]
        }
    })

@student_bp.route('/academic-records', methods=['GET'])
@roles_required('student')
def get_my_academic_records():
    """Retrieve student's academic marks, subjects, and grades."""
    student = g.current_user.student_profile
    records = AcademicRecord.query.filter_by(student_id=student.id).all()
    return jsonify({
        'status': 'success',
        'data': [r.to_dict() for r in records]
    })

@student_bp.route('/attendance', methods=['GET'])
@roles_required('student')
def get_my_attendance():
    """Retrieve student's subject-wise attendance logs."""
    student = g.current_user.student_profile
    attendances = Attendance.query.filter_by(student_id=student.id).order_by(Attendance.date.desc()).all()
    return jsonify({
        'status': 'success',
        'data': [a.to_dict() for a in attendances]
    })

@student_bp.route('/examinations', methods=['GET'])
@roles_required('student')
def get_my_examinations():
    """Retrieve student's exam schedules, registrations, hall tickets, and published results."""
    student = g.current_user.student_profile

    # Department exam timetables
    schedules = ExamSchedule.query.filter_by(department_id=student.department_id).order_by(ExamSchedule.exam_date.asc()).all()
    # Registrations
    registrations = ExamRegistration.query.filter_by(student_id=student.id).all()
    # Hall tickets
    hall_tickets = HallTicket.query.filter_by(student_id=student.id, status='active').all()
    # Results
    results = Result.query.filter_by(student_id=student.id).order_by(Result.published_date.desc()).all()

    return jsonify({
        'status': 'success',
        'data': {
            'schedules': [s.to_dict() for s in schedules],
            'registrations': [r.to_dict() for r in registrations],
            'hall_tickets': [h.to_dict() for h in hall_tickets],
            'results': [r.to_dict() for r in results]
        }
    })

@student_bp.route('/examinations/register', methods=['POST'])
@roles_required('student')
def register_for_exam():
    """Student registers for an upcoming exam schedule."""
    student = g.current_user.student_profile
    data = request.get_json() or {}
    schedule_id = data.get('schedule_id')

    if not schedule_id:
        return jsonify({'status': 'error', 'message': 'Schedule ID is required.'}), 400

    schedule = ExamSchedule.query.get(schedule_id)
    if not schedule:
        return jsonify({'status': 'error', 'message': 'Exam schedule not found.'}), 404

    existing = ExamRegistration.query.filter_by(student_id=student.id, exam_schedule_id=schedule.id).first()
    if existing:
        return jsonify({'status': 'error', 'message': 'Already registered for this exam.'}), 400

    reg = ExamRegistration(
        student_id=student.id,
        exam_schedule_id=schedule.id,
        status='registered'
    )
    db.session.add(reg)
    db.session.commit()

    log_audit(
        action='EXAM_REGISTRATION',
        resource_type='exam_registration',
        resource_id=str(reg.id),
        department_id=student.department_id,
        user_id=g.current_user.id
    )

    return jsonify({
        'status': 'success',
        'message': f'Successfully registered for {schedule.subject_name} examination.',
        'data': reg.to_dict()
    }), 201

@student_bp.route('/placements', methods=['GET'])
@roles_required('student')
def get_my_placements():
    """View eligible campus placement drives, student applications, and received offers."""
    student = g.current_user.student_profile
    dept_code = student.department.code

    # Drives where student meets CGPA and department eligibility
    drives = PlacementDrive.query.filter(
        PlacementDrive.min_cgpa <= student.cgpa,
        PlacementDrive.status == 'open'
    ).all()

    # Filter eligible departments
    eligible_drives = []
    for d in drives:
        if d.eligible_departments == 'All' or dept_code.upper() in d.eligible_departments.upper().split(','):
            eligible_drives.append(d.to_dict())

    applications = Application.query.filter_by(student_id=student.id).all()
    offers = Offer.query.filter_by(student_id=student.id).all()

    return jsonify({
        'status': 'success',
        'data': {
            'eligible_drives': eligible_drives,
            'applications': [a.to_dict() for a in applications],
            'offers': [o.to_dict() for o in offers]
        }
    })

@student_bp.route('/placements/apply', methods=['POST'])
@roles_required('student')
def apply_placement_drive():
    """Apply to an open placement drive."""
    student = g.current_user.student_profile
    data = request.get_json() or {}
    drive_id = data.get('placement_drive_id')

    if not drive_id:
        return jsonify({'status': 'error', 'message': 'Placement drive ID is required.'}), 400

    drive = PlacementDrive.query.get(drive_id)
    if not drive or drive.status != 'open':
        return jsonify({'status': 'error', 'message': 'Placement drive is not available or closed.'}), 400

    if student.cgpa < drive.min_cgpa:
        return jsonify({'status': 'error', 'message': f'CGPA requirement of {drive.min_cgpa} is not met (Current: {student.cgpa}).'}), 400

    existing = Application.query.filter_by(placement_drive_id=drive.id, student_id=student.id).first()
    if existing:
        return jsonify({'status': 'error', 'message': 'You have already applied to this placement drive.'}), 400

    app_record = Application(
        placement_drive_id=drive.id,
        student_id=student.id,
        status='applied'
    )
    db.session.add(app_record)
    db.session.commit()

    log_audit(
        action='APPLY_PLACEMENT_DRIVE',
        resource_type='application',
        resource_id=str(app_record.id),
        user_id=g.current_user.id,
        details={'drive_title': drive.title, 'company': drive.company.name}
    )

    return jsonify({
        'status': 'success',
        'message': f'Application submitted successfully for {drive.title}.',
        'data': app_record.to_dict()
    }), 201

@student_bp.route('/privacy/notices', methods=['GET'])
@roles_required('student')
def get_privacy_notices():
    """Get active DPDP Privacy Notices and user consent status."""
    inst_id = g.current_user.institution_id
    notices = PrivacyNotice.query.filter_by(institution_id=inst_id, is_active=True).all()
    user_consents = ConsentRecord.query.filter_by(user_id=g.current_user.id).all()

    return jsonify({
        'status': 'success',
        'data': {
            'notices': [n.to_dict() for n in notices],
            'consents': [c.to_dict() for c in user_consents]
        }
    })

@student_bp.route('/privacy/consent', methods=['POST'])
@roles_required('student')
def record_consent():
    """Record student consent for personal data processing."""
    data = request.get_json() or {}
    notice_id = data.get('privacy_notice_id')
    consent_type = data.get('consent_type', 'academic_processing')
    granted = data.get('granted', True)

    consent = ConsentRecord(
        user_id=g.current_user.id,
        privacy_notice_id=notice_id or 1,
        consent_type=consent_type,
        granted=granted,
        ip_address=request.remote_addr
    )
    db.session.add(consent)
    db.session.commit()

    log_audit(
        action='CONSENT_RECORDED',
        resource_type='consent',
        resource_id=str(consent.id),
        user_id=g.current_user.id,
        details={'consent_type': consent_type, 'granted': granted}
    )

    return jsonify({
        'status': 'success',
        'message': 'Consent preference recorded.',
        'data': consent.to_dict()
    })

@student_bp.route('/privacy/requests', methods=['GET', 'POST'])
@roles_required('student')
def manage_privacy_requests():
    """Submit and track DPDP Privacy Requests (data access, erasure inquiry, grievance)."""
    student = g.current_user.student_profile

    if request.method == 'GET':
        requests = PrivacyRequest.query.filter_by(student_id=student.id).order_by(PrivacyRequest.requested_at.desc()).all()
        return jsonify({
            'status': 'success',
            'data': [r.to_dict() for r in requests]
        })

    data = request.get_json() or {}
    request_type = data.get('request_type', 'data_access')
    details = data.get('details', '').strip()

    if not details:
        return jsonify({'status': 'error', 'message': 'Details are required for privacy request.'}), 400

    pr = PrivacyRequest(
        student_id=student.id,
        request_type=request_type,
        details=details,
        status='pending'
    )
    db.session.add(pr)
    db.session.commit()

    log_audit(
        action='SUBMIT_PRIVACY_REQUEST',
        resource_type='privacy_request',
        resource_id=str(pr.id),
        department_id=student.department_id,
        user_id=g.current_user.id,
        details={'type': request_type}
    )

    return jsonify({
        'status': 'success',
        'message': 'Privacy request logged. Our Data Protection Officer / Admin will review it.',
        'data': pr.to_dict()
    }), 201

@student_bp.route('/correction-requests', methods=['GET', 'POST'])
@roles_required('student')
def manage_correction_requests():
    """
    Submit and track Student Data Correction Requests.
    Enables students to exercise their DPDP Right to Correction for inaccurate or outdated records.
    """
    student = g.current_user.student_profile

    if request.method == 'GET':
        requests = CorrectionRequest.query.filter_by(student_id=student.id).order_by(CorrectionRequest.created_at.desc()).all()
        return jsonify({
            'status': 'success',
            'data': [r.to_dict() for r in requests]
        })

    data = request.get_json() or {}
    field_name = data.get('field_name', '').strip() # e.g. 'full_name', 'phone_masked', 'guardian_contact', 'address'
    current_val = data.get('current_value', '')
    requested_val = data.get('requested_value', '').strip()
    justification = data.get('justification', '').strip()

    if not field_name or not requested_val or not justification:
        return jsonify({'status': 'error', 'message': 'Field name, requested value, and justification are required.'}), 400

    cr = CorrectionRequest(
        student_id=student.id,
        field_name=field_name,
        current_value=current_val,
        requested_value=requested_val,
        justification=justification,
        status='pending'
    )
    db.session.add(cr)
    db.session.commit()

    log_audit(
        action='SUBMIT_CORRECTION_REQUEST',
        resource_type='correction_request',
        resource_id=str(cr.id),
        department_id=student.department_id,
        user_id=g.current_user.id,
        details={'field': field_name, 'requested_value': requested_val}
    )

    return jsonify({
        'status': 'success',
        'message': f'Correction request for "{field_name}" submitted to Academic Department Admin.',
        'data': cr.to_dict()
    }), 201
