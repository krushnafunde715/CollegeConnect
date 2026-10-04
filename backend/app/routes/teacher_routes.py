from datetime import datetime, date
from flask import Blueprint, request, jsonify, g
from app.extensions import db
from app.security.decorators import roles_required
from app.security.audit import log_audit
from app.models.institution import ClassRoom
from app.models.academic import Student, TeacherAssignment, Attendance, AcademicRecord

teacher_bp = Blueprint('teacher', __name__, url_prefix='/api/teacher')

@teacher_bp.route('/my-classes', methods=['GET'])
@roles_required('teacher')
def get_assigned_classes():
    """List only the classes assigned to the authenticated teacher."""
    teacher_id = g.current_user.id
    assignments = TeacherAssignment.query.filter_by(user_id=teacher_id).all()
    
    classes_data = []
    seen_classes = set()
    for a in assignments:
        c = a.classroom
        if c and c.id not in seen_classes:
            seen_classes.add(c.id)
            c_dict = c.to_dict()
            c_dict['assigned_subject'] = a.subject_name
            c_dict['is_class_teacher'] = a.is_class_teacher
            classes_data.append(c_dict)

    return jsonify({
        'status': 'success',
        'data': classes_data
    })

@teacher_bp.route('/classes/<int:class_id>/students', methods=['GET'])
@roles_required('teacher')
def get_class_students(class_id):
    """
    View authorized students for an assigned class.
    Enforces Class-Level Access Control and privacy minimization (masked guardian contact, no unneeded PII).
    """
    teacher_id = g.current_user.id
    # Verify teacher is assigned to this class
    assignment = TeacherAssignment.query.filter_by(user_id=teacher_id, class_id=class_id).first()
    if not assignment:
        log_audit(
            action='TEACHER_UNAUTHORIZED_CLASS_ACCESS',
            resource_type='class',
            resource_id=str(class_id),
            status='denied',
            details={'teacher_id': teacher_id, 'attempted_class': class_id}
        )
        return jsonify({
            'status': 'error',
            'message': 'Access denied: You are not assigned to teach or manage this class.',
            'code': 'UNASSIGNED_CLASS_ACCESS'
        }), 403

    students = Student.query.filter_by(current_class_id=class_id).all()
    return jsonify({
        'status': 'success',
        'data': [s.to_dict(for_teacher=True) for s in students]
    })

@teacher_bp.route('/attendance', methods=['GET', 'POST'])
@roles_required('teacher')
def manage_attendance():
    """Record or view daily attendance for assigned class."""
    teacher_id = g.current_user.id

    if request.method == 'GET':
        class_id = request.args.get('class_id')
        date_str = request.args.get('date', date.today().isoformat())

        if not class_id:
            return jsonify({'status': 'error', 'message': 'Class ID is required.'}), 400

        # Verify assignment
        assignment = TeacherAssignment.query.filter_by(user_id=teacher_id, class_id=int(class_id)).first()
        if not assignment:
            return jsonify({'status': 'error', 'message': 'You are not assigned to this class.'}), 403

        target_date = datetime.strptime(date_str, '%Y-%m-%d').date()
        records = Attendance.query.filter_by(class_id=int(class_id), date=target_date).all()
        return jsonify({
            'status': 'success',
            'data': [r.to_dict() for r in records]
        })

    # POST: Record attendance batch
    data = request.get_json() or {}
    class_id = data.get('class_id')
    subject_name = data.get('subject_name')
    date_str = data.get('date', date.today().isoformat())
    attendance_list = data.get('attendance', []) # list of { student_id, status: 'present'/'absent' }

    if not class_id or not subject_name or not attendance_list:
        return jsonify({'status': 'error', 'message': 'Class ID, Subject Name, and Attendance list are required.'}), 400

    assignment = TeacherAssignment.query.filter_by(user_id=teacher_id, class_id=int(class_id)).first()
    if not assignment:
        return jsonify({'status': 'error', 'message': 'Unauthorized: Not assigned to this class.'}), 403

    target_date = datetime.strptime(date_str, '%Y-%m-%d').date()

    for item in attendance_list:
        student_id = item.get('student_id')
        status = item.get('status', 'present')

        # Check existing attendance record
        att = Attendance.query.filter_by(
            student_id=student_id,
            class_id=int(class_id),
            date=target_date,
            subject_name=subject_name
        ).first()

        if att:
            att.status = status
            att.recorded_by_user_id = teacher_id
        else:
            att = Attendance(
                student_id=student_id,
                class_id=int(class_id),
                date=target_date,
                subject_name=subject_name,
                status=status,
                recorded_by_user_id=teacher_id
            )
            db.session.add(att)

    db.session.commit()

    log_audit(
        action='RECORD_ATTENDANCE',
        resource_type='attendance',
        resource_id=f"class_{class_id}_{date_str}",
        department_id=assignment.department_id,
        details={'class_id': class_id, 'date': date_str, 'count': len(attendance_list)}
    )

    return jsonify({
        'status': 'success',
        'message': f'Attendance recorded successfully for {len(attendance_list)} students.'
    })

@teacher_bp.route('/academic-records', methods=['POST'])
@roles_required('teacher')
def enter_academic_records():
    """Enter or update internal/semester marks for assigned class."""
    teacher_id = g.current_user.id
    data = request.get_json() or {}
    class_id = data.get('class_id')
    student_id = data.get('student_id')
    semester = data.get('semester', 'Semester 3')
    subject_code = data.get('subject_code', 'CS301')
    subject_name = data.get('subject_name', '')
    internal_marks = float(data.get('internal_marks', 0))
    external_marks = float(data.get('external_marks', 0))
    grade = data.get('grade', 'A')

    if not class_id or not student_id or not subject_name:
        return jsonify({'status': 'error', 'message': 'Class, Student, and Subject Name are required.'}), 400

    assignment = TeacherAssignment.query.filter_by(user_id=teacher_id, class_id=int(class_id)).first()
    if not assignment:
        return jsonify({'status': 'error', 'message': 'Not authorized to submit marks for this class.'}), 403

    record = AcademicRecord.query.filter_by(
        student_id=student_id,
        class_id=class_id,
        semester=semester,
        subject_name=subject_name
    ).first()

    total_marks = internal_marks + external_marks
    pass_status = 'pass' if total_marks >= 40 else 'fail'

    if record:
        record.internal_marks = internal_marks
        record.external_marks = external_marks
        record.total_marks = total_marks
        record.grade = grade
        record.status = pass_status
    else:
        record = AcademicRecord(
            student_id=student_id,
            class_id=class_id,
            semester=semester,
            subject_code=subject_code,
            subject_name=subject_name,
            internal_marks=internal_marks,
            external_marks=external_marks,
            total_marks=total_marks,
            grade=grade,
            status=pass_status
        )
        db.session.add(record)

    db.session.commit()

    log_audit(
        action='UPDATE_ACADEMIC_RECORD',
        resource_type='academic_record',
        resource_id=str(record.id),
        department_id=assignment.department_id,
        details={'student_id': student_id, 'subject': subject_name, 'total_marks': total_marks}
    )

    return jsonify({
        'status': 'success',
        'message': 'Academic record updated successfully.',
        'data': record.to_dict()
    })
