from datetime import datetime
from flask import Blueprint, request, jsonify, g
from app.extensions import db
from app.security.decorators import roles_required
from app.security.audit import log_audit
from app.models.academic import Student
from app.models.placement import Company, PlacementDrive, Application, Offer

placement_admin_bp = Blueprint('placement_admin', __name__, url_prefix='/api/placement')

@placement_admin_bp.route('/companies', methods=['GET', 'POST'])
@roles_required('placement_admin', 'super_admin')
def manage_companies():
    """List or register recruiting companies."""
    if request.method == 'GET':
        companies = Company.query.all()
        return jsonify({
            'status': 'success',
            'data': [c.to_dict() for c in companies]
        })

    data = request.get_json() or {}
    name = data.get('name', '').strip()
    industry = data.get('industry', '').strip()
    website = data.get('website', '').strip()
    contact_email = data.get('contact_email', '').strip()
    description = data.get('description', '')

    if not name or not industry:
        return jsonify({'status': 'error', 'message': 'Company name and industry are required.'}), 400

    existing = Company.query.filter_by(name=name).first()
    if existing:
        return jsonify({'status': 'error', 'message': f'Company "{name}" already exists.'}), 400

    comp = Company(
        name=name,
        industry=industry,
        website=website,
        contact_email=contact_email,
        description=description
    )
    db.session.add(comp)
    db.session.commit()

    log_audit(
        action='CREATE_COMPANY',
        resource_type='company',
        resource_id=str(comp.id),
        details={'name': name, 'industry': industry}
    )

    return jsonify({
        'status': 'success',
        'message': f'Company {name} registered successfully.',
        'data': comp.to_dict()
    }), 201

@placement_admin_bp.route('/drives', methods=['GET', 'POST'])
@roles_required('placement_admin', 'super_admin')
def manage_drives():
    """List or create campus recruitment drives."""
    if request.method == 'GET':
        drives = PlacementDrive.query.order_by(PlacementDrive.drive_date.desc()).all()
        return jsonify({
            'status': 'success',
            'data': [d.to_dict() for d in drives]
        })

    data = request.get_json() or {}
    company_id = data.get('company_id')
    title = data.get('title', '').strip()
    role_description = data.get('role_description', '')
    eligible_departments = data.get('eligible_departments', 'COMP,IT,ENTC')
    min_cgpa = float(data.get('min_cgpa', 6.5))
    package_details = data.get('package_details', '12 LPA')
    drive_date_str = data.get('drive_date')
    deadline_str = data.get('registration_deadline')
    location = data.get('location', 'On-Campus Placement Cell')

    if not company_id or not title or not drive_date_str or not deadline_str:
        return jsonify({'status': 'error', 'message': 'Company ID, Title, Drive Date, and Deadline are required.'}), 400

    drive_date = datetime.strptime(drive_date_str, '%Y-%m-%d').date()
    deadline = datetime.strptime(deadline_str, '%Y-%m-%d').date()

    drive = PlacementDrive(
        company_id=company_id,
        title=title,
        role_description=role_description,
        eligible_departments=eligible_departments,
        min_cgpa=min_cgpa,
        package_details=package_details,
        drive_date=drive_date,
        registration_deadline=deadline,
        location=location,
        status='open'
    )
    db.session.add(drive)
    db.session.commit()

    log_audit(
        action='CREATE_PLACEMENT_DRIVE',
        resource_type='placement_drive',
        resource_id=str(drive.id),
        details={'title': title, 'company_id': company_id, 'package': package_details}
    )

    return jsonify({
        'status': 'success',
        'message': f'Placement drive "{title}" published.',
        'data': drive.to_dict()
    }), 201

@placement_admin_bp.route('/eligible-students', methods=['GET'])
@roles_required('placement_admin', 'super_admin')
def get_eligible_students():
    """
    Retrieve purpose-limited student data for placements.
    Under DPDP principles: Only academic department, CGPA, and institutional email are revealed for placement purposes.
    Personal home addresses, guardian medical data, etc., are omitted.
    """
    min_cgpa = float(request.args.get('min_cgpa', 6.0))
    dept_code = request.args.get('dept_code')

    query = Student.query.filter(Student.cgpa >= min_cgpa)
    students = query.all()

    filtered = []
    for s in students:
        if dept_code and s.department.code.upper() != dept_code.upper():
            continue
        filtered.append({
            'student_id': s.id,
            'college_id': s.college_id,
            'full_name': s.user.full_name if s.user else None,
            'email': s.user.email if s.user else None,
            'department_name': s.department.name if s.department else None,
            'department_code': s.department.code if s.department else None,
            'class_name': s.current_class.name if s.current_class else None,
            'cgpa': s.cgpa
        })

    return jsonify({
        'status': 'success',
        'data': filtered
    })

@placement_admin_bp.route('/applications', methods=['GET', 'POST'])
@roles_required('placement_admin', 'super_admin')
def manage_applications():
    """List or update candidate application status."""
    if request.method == 'GET':
        drive_id = request.args.get('drive_id')
        query = Application.query.order_by(Application.applied_at.desc())
        if drive_id:
            query = query.filter_by(placement_drive_id=int(drive_id))
        apps = query.all()
        return jsonify({
            'status': 'success',
            'data': [a.to_dict() for a in apps]
        })

    data = request.get_json() or {}
    app_id = data.get('application_id')
    status = data.get('status') # 'shortlisted', 'interviewing', 'selected', 'rejected'
    notes = data.get('notes', '')

    app_record = Application.query.get(app_id)
    if not app_record:
        return jsonify({'status': 'error', 'message': 'Application not found.'}), 404

    app_record.status = status
    if notes:
        app_record.notes = notes
    db.session.commit()

    log_audit(
        action=f'UPDATE_PLACEMENT_APP_STATUS',
        resource_type='application',
        resource_id=str(app_record.id),
        details={'student_id': app_record.student_id, 'new_status': status}
    )

    return jsonify({
        'status': 'success',
        'message': f'Application status updated to {status}.',
        'data': app_record.to_dict()
    })

@placement_admin_bp.route('/offers', methods=['GET', 'POST'])
@roles_required('placement_admin', 'super_admin')
def manage_offers():
    """Issue and list job offers."""
    if request.method == 'GET':
        offers = Offer.query.order_by(Offer.created_at.desc()).all()
        return jsonify({
            'status': 'success',
            'data': [o.to_dict() for o in offers]
        })

    data = request.get_json() or {}
    application_id = data.get('application_id')
    designation = data.get('designation', '').strip()
    ctc = data.get('ctc', '').strip()

    app_record = Application.query.get(application_id)
    if not app_record:
        return jsonify({'status': 'error', 'message': 'Application not found.'}), 404

    offer = Offer(
        application_id=app_record.id,
        student_id=app_record.student_id,
        placement_drive_id=app_record.placement_drive_id,
        designation=designation,
        ctc=ctc,
        status='offered'
    )
    app_record.status = 'selected'
    db.session.add(offer)
    db.session.commit()

    log_audit(
        action='ISSUE_JOB_OFFER',
        resource_type='offer',
        resource_id=str(offer.id),
        details={'student_id': app_record.student_id, 'designation': designation, 'ctc': ctc}
    )

    return jsonify({
        'status': 'success',
        'message': f'Job offer issued to {app_record.student.user.full_name}.',
        'data': offer.to_dict()
    }), 201
