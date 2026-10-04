import os
from flask import Flask, jsonify
from app.config import config_by_name
from app.extensions import db, migrate, cors, limiter

def create_app(config_name=None):
    if config_name is None:
        config_name = os.getenv('FLASK_ENV', 'development')

    app = Flask(__name__)
    app.config.from_object(config_by_name.get(config_name, config_by_name['default']))

    # Initialize Extensions
    db.init_app(app)
    migrate.init_app(app, db)
    limiter.init_app(app)
    cors.init_app(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)

    # Register Blueprints
    from app.routes.auth_routes import auth_bp
    from app.routes.superadmin_routes import superadmin_bp
    from app.routes.academic_admin_routes import academic_admin_bp
    from app.routes.teacher_routes import teacher_bp
    from app.routes.exam_admin_routes import exam_admin_bp
    from app.routes.placement_admin_routes import placement_admin_bp
    from app.routes.student_routes import student_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(superadmin_bp)
    app.register_blueprint(academic_admin_bp)
    app.register_blueprint(teacher_bp)
    app.register_blueprint(exam_admin_bp)
    app.register_blueprint(placement_admin_bp)
    app.register_blueprint(student_bp)

    # Security Headers Hook
    @app.after_request
    def set_security_headers(response):
        response.headers['X-Content-Type-Options'] = 'nosniff'
        response.headers['X-Frame-Options'] = 'DENY'
        response.headers['X-XSS-Protection'] = '1; mode=block'
        response.headers['Referrer-Policy'] = 'strict-origin-when-cross-origin'
        return response

    # Global Error Handlers
    @app.errorhandler(404)
    def not_found_error(error):
        return jsonify({
            'status': 'error',
            'message': 'Requested resource or endpoint not found.',
            'code': 'NOT_FOUND'
        }), 404

    @app.errorhandler(429)
    def ratelimit_handler(e):
        return jsonify({
            'status': 'error',
            'message': f'Rate limit exceeded: {e.description}',
            'code': 'RATE_LIMIT_EXCEEDED'
        }), 429

    @app.errorhandler(500)
    def internal_error(error):
        db.session.rollback()
        return jsonify({
            'status': 'error',
            'message': 'An internal server error occurred.',
            'code': 'INTERNAL_SERVER_ERROR'
        }), 500

    @app.route('/api/health', methods=['GET'])
    def health_check():
        return jsonify({
            'status': 'healthy',
            'app': 'CollegeConnect API',
            'version': '1.0.0',
            'dpdp_principles_enabled': True
        })

    return app
