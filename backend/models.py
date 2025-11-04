from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    """User model"""
    __tablename__ = 'users'
    
    user_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(100), nullable=False, unique=True)
    email = db.Column(db.String(100), nullable=False, unique=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    workouts = db.relationship('Workout', backref='user', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'user_id': self.user_id,
            'username': self.username,
            'email': self.email,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class Exercise(db.Model):
    """Exercise model - stores exercise types"""
    __tablename__ = 'exercises'
    
    exercise_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), nullable=False, unique=True)
    category = db.Column(db.String(50), nullable=False)  # strength, cardio, flexibility
    muscle_group = db.Column(db.String(50))
    description = db.Column(db.Text)
    
    # Relationships
    workout_exercises = db.relationship('WorkoutExercise', backref='exercise', lazy=True)
    
    def to_dict(self):
        return {
            'exercise_id': self.exercise_id,
            'name': self.name,
            'category': self.category,
            'muscle_group': self.muscle_group,
            'description': self.description
        }


class Workout(db.Model):
    """Workout model - stores workout sessions"""
    __tablename__ = 'workouts'
    
    workout_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id', ondelete='CASCADE'), nullable=False)
    workout_date = db.Column(db.Date, nullable=False)
    duration_minutes = db.Column(db.Integer)
    notes = db.Column(db.Text)
    
    # Relationships
    workout_exercises = db.relationship('WorkoutExercise', backref='workout', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self, include_exercises=False):
        result = {
            'workout_id': self.workout_id,
            'user_id': self.user_id,
            'workout_date': self.workout_date.isoformat() if self.workout_date else None,
            'duration_minutes': self.duration_minutes,
            'notes': self.notes
        }
        
        if include_exercises:
            result['exercises'] = [we.to_dict() for we in self.workout_exercises]
        
        return result


class WorkoutExercise(db.Model):
    """WorkoutExercise model - stores individual exercise logs within a workout"""
    __tablename__ = 'workout_exercises'
    
    log_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    workout_id = db.Column(db.Integer, db.ForeignKey('workouts.workout_id', ondelete='CASCADE'), nullable=False)
    exercise_id = db.Column(db.Integer, db.ForeignKey('exercises.exercise_id'), nullable=False)
    sets = db.Column(db.Integer)
    reps = db.Column(db.Integer)
    weight_lbs = db.Column(db.Float)
    distance_miles = db.Column(db.Float)
    duration_seconds = db.Column(db.Integer)
    
    def to_dict(self):
        return {
            'log_id': self.log_id,
            'workout_id': self.workout_id,
            'exercise_id': self.exercise_id,
            'exercise_name': self.exercise.name if self.exercise else None,
            'exercise_category': self.exercise.category if self.exercise else None,
            'sets': self.sets,
            'reps': self.reps,
            'weight_lbs': self.weight_lbs,
            'distance_miles': self.distance_miles,
            'duration_seconds': self.duration_seconds
        }

