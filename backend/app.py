from flask import Flask, jsonify
from flask_cors import CORS
from config import Config
from models import db
from routes import api
import os

def create_app(config_class=Config):
    """Application factory"""
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Initialize extensions
    db.init_app(app)
    
    # Enable CORS for React frontend
    # Allow localhost and all Vercel domains using regex patterns
    CORS(app, resources={
        r"/api/*": {
            "origins": [
                r"http://localhost:\d+",  # Any localhost port
                r"https://.*\.vercel\.app",  # Any Vercel subdomain
            ],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type"],
            "supports_credentials": False
        }
    })
    
    # Register blueprints
    app.register_blueprint(api)
    
    # Root endpoint
    @app.route('/')
    def index():
        return jsonify({
            'message': 'Workout Tracker API',
            'version': '1.0',
            'endpoints': {
                'exercises': '/api/exercises',
                'workouts': '/api/workouts',
                'reports': '/api/reports/summary',
                'categories': '/api/categories',
                'health': '/api/health'
            }
        })
    
    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'error': 'Not found'}), 404
    
    @app.errorhandler(500)
    def internal_error(error):
        db.session.rollback()
        return jsonify({'error': 'Internal server error'}), 500
    
    return app


if __name__ == '__main__':
    app = create_app()
    
    # Create tables if they don't exist
    with app.app_context():
        db.create_all()
        print("Database tables created successfully!")
    
    print("Starting Flask server on http://localhost:5001")
    print("API endpoints available at http://localhost:5001/api/")
    
    app.run(debug=True, host='0.0.0.0', port=5001)

