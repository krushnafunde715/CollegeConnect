import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key-collegeconnect-change-in-prod-dpdp-2026")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "dev-jwt-secret-key-collegeconnect-2026")
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=int(os.getenv("JWT_ACCESS_HOURS", "8")))

    # Database
    # Support PostgreSQL with SQLite local development fallback
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL",
        f"sqlite:///{os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'collegeconnect.db'))}"
    )
    # Fix potential postgres:// vs postgresql:// URI format
    if SQLALCHEMY_DATABASE_URI.startswith("postgres://"):
        SQLALCHEMY_DATABASE_URI = SQLALCHEMY_DATABASE_URI.replace("postgres://", "postgresql://", 1)

    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO = os.getenv("SQLALCHEMY_ECHO", "false").lower() == "true"

    # Institution Settings
    INSTITUTION_NAME = os.getenv("INSTITUTION_NAME", "CollegeConnect Institute of Technology")
    INSTITUTION_CODE = os.getenv("INSTITUTION_CODE", "CCIT")
    INSTITUTION_DOMAIN = os.getenv("INSTITUTION_DOMAIN", "college.edu")

    # Email / Notification Delivery Interface
    MAIL_SERVER = os.getenv("MAIL_SERVER", "")
    MAIL_PORT = int(os.getenv("MAIL_PORT", "587"))
    MAIL_USERNAME = os.getenv("MAIL_USERNAME", "")
    MAIL_PASSWORD = os.getenv("MAIL_PASSWORD", "")
    MAIL_USE_TLS = os.getenv("MAIL_USE_TLS", "true").lower() == "true"
    MAIL_DEFAULT_SENDER = os.getenv("MAIL_DEFAULT_SENDER", f"no-reply@{os.getenv('INSTITUTION_DOMAIN', 'college.edu')}")
    DEV_EMAIL_CAPTURE_ENABLED = os.getenv("DEV_EMAIL_CAPTURE_ENABLED", "true").lower() == "true"

    # Security & Tokens
    VERIFICATION_TOKEN_EXPIRE_HOURS = int(os.getenv("VERIFICATION_TOKEN_EXPIRE_HOURS", "24"))
    RESET_TOKEN_EXPIRE_MINUTES = int(os.getenv("RESET_TOKEN_EXPIRE_MINUTES", "60"))
    
    # Argon2 Parameters
    ARGON2_TIME_COST = int(os.getenv("ARGON2_TIME_COST", "3"))
    ARGON2_MEMORY_COST = int(os.getenv("ARGON2_MEMORY_COST", "65536"))
    ARGON2_PARALLELISM = int(os.getenv("ARGON2_PARALLELISM", "4"))

    # Initial Setup Security
    SETUP_COMPLETED = os.getenv("SETUP_COMPLETED", "false").lower() == "true"
    INITIAL_SETUP_TOKEN = os.getenv("INITIAL_SETUP_TOKEN", "INIT-CCIT-SECURE-SETUP-KEY-2026")

class DevelopmentConfig(Config):
    DEBUG = True
    ENV = "development"

class TestingConfig(Config):
    TESTING = True
    DEBUG = False
    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"
    RATELIMIT_ENABLED = False
    DEV_EMAIL_CAPTURE_ENABLED = True
    WTF_CSRF_ENABLED = False

class ProductionConfig(Config):
    DEBUG = False
    ENV = "production"
    DEV_EMAIL_CAPTURE_ENABLED = False

config_by_name = {
    "development": DevelopmentConfig,
    "testing": TestingConfig,
    "production": ProductionConfig,
    "default": DevelopmentConfig
}
