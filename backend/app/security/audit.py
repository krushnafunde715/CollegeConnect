from datetime import datetime
from flask import request, g, current_app
from app.extensions import db
from app.models.privacy import AuditLog

def log_audit(
    action: str,
    resource_type: str = None,
    resource_id: str = None,
    department_id: int = None,
    status: str = 'success',
    details: dict = None,
    user_id: int = None,
    institution_id: int = None
):
    """
    Persist an audit record for security monitoring, access history, and DPDP compliance.
    """
    try:
        current_user = getattr(g, 'current_user', None)
        effective_user_id = user_id or (current_user.id if current_user else None)
        effective_inst_id = institution_id or (current_user.institution_id if current_user else 1)
        
        # IP and User-Agent resolution
        ip_addr = "127.0.0.1"
        user_agent_str = "system"
        if request:
            if request.headers.get('X-Forwarded-For'):
                ip_addr = request.headers.get('X-Forwarded-For').split(',')[0].strip()
            elif request.remote_addr:
                ip_addr = request.remote_addr
            user_agent_str = (request.user_agent.string or "unknown")[:255] if request.user_agent else "unknown"

        # Sanitize details (never log passwords, raw tokens, or sensitive credentials)
        clean_details = {}
        if details and isinstance(details, dict):
            for k, v in details.items():
                if any(sec in k.lower() for sec in ['password', 'token', 'secret', 'key', 'auth']):
                    clean_details[k] = '[REDACTED]'
                else:
                    clean_details[k] = str(v) if not isinstance(v, (int, float, bool, list, dict)) else v

        log_entry = AuditLog(
            institution_id=effective_inst_id,
            user_id=effective_user_id,
            action=action,
            resource_type=resource_type,
            resource_id=str(resource_id) if resource_id is not None else None,
            department_id=department_id or (current_user.get_department_id() if current_user else None),
            ip_address=ip_addr,
            user_agent=user_agent_str,
            status=status,
            details=clean_details,
            timestamp=datetime.utcnow()
        )
        db.session.add(log_entry)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        # In case audit logging fails, log to stdout but don't crash the application
        if current_app:
            current_app.logger.error(f"Audit log failed: {e}")
