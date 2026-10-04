import secrets
import hashlib
from datetime import datetime, timedelta

def generate_secure_token() -> str:
    """Generate a high-entropy URL-safe cryptographic token."""
    return secrets.token_urlsafe(32)

def hash_token(raw_token: str) -> str:
    """Hash token using SHA-256 for secure database storage."""
    return hashlib.sha256(raw_token.encode('utf-8')).hexdigest()

def calculate_token_expiration(hours: int = 24, minutes: int = 0) -> datetime:
    """Calculate token expiration timestamp."""
    delta = timedelta(hours=hours, minutes=minutes)
    return datetime.utcnow() + delta
