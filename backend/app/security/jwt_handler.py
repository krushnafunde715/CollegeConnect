import jwt
from datetime import datetime, timezone, timedelta
from flask import current_app

def generate_jwt(user_id: int, email: str, role_name: str, department_id: int = None, session_id: int = None) -> str:
    """Generate a signed JWT token containing user identity and role scopes."""
    secret = current_app.config['JWT_SECRET_KEY']
    expires = datetime.now(timezone.utc) + current_app.config['JWT_ACCESS_TOKEN_EXPIRES']
    
    payload = {
        'sub': str(user_id), # Standard JWT sub claim MUST be string in RFC 7519
        'user_id': user_id,
        'email': email,
        'role': role_name,
        'department_id': department_id,
        'session_id': session_id,
        'iat': datetime.now(timezone.utc),
        'exp': expires
    }
    return jwt.encode(payload, secret, algorithm='HS256')

def decode_jwt(token: str) -> dict:
    """Decode and verify a signed JWT token."""
    secret = current_app.config['JWT_SECRET_KEY']
    try:
        payload = jwt.decode(token, secret, algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        raise ValueError("Token has expired. Please log in again.")
    except jwt.InvalidTokenError as e:
        raise ValueError(f"Invalid authentication token: {str(e)}")
