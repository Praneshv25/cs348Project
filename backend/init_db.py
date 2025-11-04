"""
Database initialization script
Run this to create the database tables
"""

from app import create_app
from models import db

def init_database():
    """Initialize the database"""
    app = create_app()
    
    with app.app_context():
        # Drop all tables (use with caution!)
        print("Dropping all existing tables...")
        db.drop_all()
        
        # Create all tables
        print("Creating database tables...")
        db.create_all()
        
        print("✅ Database initialized successfully!")
        print(f"Database location: {app.config['SQLALCHEMY_DATABASE_URI']}")
        print("\nTables created:")
        print("  - users")
        print("  - exercises")
        print("  - workouts")
        print("  - workout_exercises")
        print("\nRun 'python seed_data.py' to populate with sample data.")


if __name__ == '__main__':
    init_database()

