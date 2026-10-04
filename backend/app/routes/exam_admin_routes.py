import hashlib
import secrets
from datetime import datetime
from flask import Blueprint, request, jsonify, g
from app.extensions import db
from app.security.decorators import roles_required
from app.security.audit import log_audit
from app.models.institution import Department, AcademicYear
from app.models.academic import Student
from app.models.examination import ExamSchedule, ExamRegistration, Result, HallTicket

exam_admin_bp = Blueprint('exam_admin', __name__, url_prefix='/api/exam')

@exam_admin_bp.route('/schedules', methods=['GET', 'POST'])
@roles_required('exam_admin', 'super_admin')
def manage_schedules():
    """List or create examination timetables/schedules."""
    if request.method == 'GET':
        schedules = ExamSchedule.query.order_by(ExamSchedule.exam_date.asc()).all()
        return jsonify({
            'status': 'success',
            'data': [s.to_dict() for s in schedules]
        })

    data = request.get_json() or {}
    department_id = data.get('department_id')
    exam_name = data.get('exam_name', '').strip()
    semester = data.get('semester', '').strip()
    subject_code = data.get('subject_code', '').strip()
    subject_name = data.get('subject_name', '').strip()
    exam_date_str = data.get('exam_date')
    start_time = data.get('start_time', '10:00 AM')
    end_time = data.get('end_time', '01:00 PM')
    venue = data.get('venue', 'Examination Hall A')
    total_marks = int(data.get('total_marks', 100))

    if not department_id or not exam_name or not subject_code or not exam_date_str:
        return jsonify({'status': 'error', 'message': 'Department, Exam Name, Subject Code, and Exam Date are required.'}), 400

    academic_year = AcademicYear.query.filter_by(is_current=True).first() or AcademicYear.query.first()
    if not academic_year:
        return jsonify({'status': 'error', 'message': 'No academic year configured.'}), 400

    exam_date = datetime.strptime(exam_date_str, '%Y-%m-%d').date()

    schedule = ExamSchedule(
        department_id=department_id,
        academic_year_id=academic_year.id,
        exam_name=exam_name,
        semester=semester,
        subject_code=subject_code,
        subject_name=subject_name,
        exam_date=exam_date,
        start_time=start_time,
        end_time=end_time,
        venue=venue,
        total_marks=total_marks
    )
    db.session.add(schedule)
    db.session.commit()

    log_audit(
        action='CREATE_EXAM_SCHEDULE',
        resource_type='exam_schedule',
        resource_id=str(schedule.id),
        department_id=department_id,
        details={'exam_name': exam_name, 'subject': subject_name, 'date': exam_date_str}
    )

    return jsonify({
        'status': 'success',
        'message': f'Exam schedule for {subject_name} created.',
        'data': schedule.to_dict()
    }), 201

@exam_admin_bp.route('/registrations', methods=['GET', 'POST'])
@roles_required('exam_admin', 'super_admin')
def manage_registrations():
    """View exam registrations or approve registrations."""
    if request.method == 'GET':
        regs = ExamRegistration.query.order_by(ExamRegistration.registered_at.desc()).all()
        return jsonify({
            'status': 'success',
            'data': [r.to_dict() for r in regs]
        })

    data = request.get_json() or {}
    reg_id = data.get('registration_id')
    status = data.get('status', 'approved') # 'approved', 'cancelled'

    reg = ExamRegistration.query.get(reg_id)
    if not reg:
        return jsonify({'status': 'error', 'message': 'Exam registration not found.'}), 404

    reg.status = status
    db.session.commit()

    return jsonify({
        'status': 'success',
        'message': f'Registration #{reg_id} status updated to {status}.',
        'data': reg.to_dict()
    })

@exam_admin_bp.route('/hall-tickets/generate', methods=['POST'])
@roles_required('exam_admin', 'super_admin')
def generate_hall_ticket():
    """
    Generate tamper-proof Hall Ticket with cryptographic verification hash.
    """
    data = request.get_json() or {}
    student_id = data.get('student_id')
    exam_name = data.get('exam_name', 'Winter 2026 End Semester Exam')
    venue = data.get('venue', 'Exam Block C, Room 301')

    if not student_id:
        return jsonify({'status': 'error', 'message': 'Student ID is required.'}), 400

    student = Student.query.get(student_id)
    if not student:
        return jsonify({'status': 'error', 'message': 'Student not found.'}), 404

    ticket_number = f"HT-{student.college_id}-{datetime.utcnow().strftime('%y%m%d%H%M')}"
    raw_hash_source = f"{student.college_id}:{exam_name}:{ticket_number}:{secrets.token_hex(8)}"
    verification_hash = hashlib.sha256(raw_hash_source.encode()).hexdigest()

    ticket = HallTicket(
        student_id=student.id,
        exam_name=exam_name,
        ticket_number=ticket_number,
        verification_hash=verification_hash,
        venue_details=venue,
        status='active'
    )
    db.session.add(ticket)
    db.session.commit()

    log_audit(
        action='GENERATE_HALL_TICKET',
        resource_type='hall_ticket',
        resource_id=str(ticket.id),
        department_id=student.department_id,
        details={'ticket_number': ticket_number, 'student_id': student.id}
    )

    return jsonify({
        'status': 'success',
        'message': f'Hall ticket generated for {student.user.full_name}.',
        'data': ticket.to_dict()
    }), 201

@exam_admin_bp.route('/results', methods=['GET', 'POST'])
@roles_required('exam_admin', 'super_admin')
def manage_results():
    """Publish and list semester results."""
    if request.method == 'GET':
        results = Result.query.order_by(Result.published_date.desc()).all()
        return jsonify({
            'status': 'success',
            'data': [r.to_dict() for r in results]
        })

    data = request.get_json() or {}
    student_id = data.get('student_id')
    semester = data.get('semester', 'Semester 3')
    exam_name = data.get('exam_name', 'Winter 2026 End Semester Exam')
    sgpa = float(data.get('sgpa', 8.5))
    cgpa = float(data.get('cgpa', 8.4))
    total_credits = float(data.get('total_credits', 24.0))
    status = data.get('status', 'pass')
    remarks = data.get('remarks', 'Cleared with Distinction')

    if not student_id:
        return jsonify({'status': 'error', 'message': 'Student ID is required.'}), 400

    student = Student.query.get(student_id)
    if not student:
        return jsonify({'status': 'error', 'message': 'Student not found.'}), 404

    # Update student's aggregate CGPA
    student.cgpa = cgpa

    res = Result.query.filter_by(student_id=student_id, semester=semester, exam_name=exam_name).first()
    if res:
        res.sgpa = sgpa
        res.cgpa = cgpa
        res.total_credits = total_credits
        res.status = status
        res.remarks = remarks
    else:
        res = Result(
            student_id=student_id,
            semester=semester,
            exam_name=exam_name,
            sgpa=sgpa,
            cgpa=cgpa,
            total_credits=total_credits,
            status=status,
            remarks=remarks
        )
        db.session.add(res)

    db.session.commit()

    log_audit(
        action='PUBLISH_RESULT',
        resource_type='result',
        resource_id=str(res.id),
        department_id=student.department_id,
        details={'student_id': student_id, 'semester': semester, 'cgpa': cgpa}
    )

    return jsonify({
        'status': 'success',
        'message': f'Result published for {student.user.full_name}.',
        'data': res.to_dict()
    }), 201
