import os

basedir = os.path.abspath(os.path.dirname(__file__))

class Config:
    """Application configuration"""
    
    # Database configuration - use PostgreSQL in production, SQLite in development
    DATABASE_URL = os.environ.get('DATABASE_URL')
    
    # Fix for PostgreSQL URL scheme (Render uses postgres:// but SQLAlchemy needs postgresql://)
    if DATABASE_URL and DATABASE_URL.startswith('postgres://'):
        DATABASE_URL = DATABASE_URL.replace('postgres://', 'postgresql://', 1)
    
    SQLALCHEMY_DATABASE_URI = DATABASE_URL or \
        'sqlite:///' + os.path.join(basedir, 'workout_tracker.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Flask configuration
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key-change-in-production'
    
    # CORS configuration
    CORS_HEADERS = 'Content-Type'

