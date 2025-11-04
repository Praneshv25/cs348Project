"""
Database seeding script
Run this to populate the database with sample data
"""

from app import create_app
from models import db, User, Exercise, Workout, WorkoutExercise
from datetime import datetime, timedelta

def seed_database():
    """Seed the database with sample data"""
    app = create_app()
    
    with app.app_context():
        # Check if data already exists
        if User.query.first():
            print("⚠️  Database already contains data.")
            response = input("Do you want to clear and reseed? (yes/no): ")
            if response.lower() != 'yes':
                print("Seeding cancelled.")
                return
            
            # Clear existing data
            print("Clearing existing data...")
            WorkoutExercise.query.delete()
            Workout.query.delete()
            Exercise.query.delete()
            User.query.delete()
            db.session.commit()
        
        print("Seeding database with sample data...")
        
        # Create Users
        print("Creating users...")
        users = [
            User(username='john_doe', email='john@example.com'),
            User(username='jane_smith', email='jane@example.com'),
            User(username='mike_wilson', email='mike@example.com')
        ]
        db.session.add_all(users)
        db.session.commit()
        print(f"✅ Created {len(users)} users")
        
        # Create Exercises
        print("Creating exercises...")
        exercises = [
            Exercise(name='Bench Press', category='strength', muscle_group='chest', 
                    description='Chest compound exercise'),
            Exercise(name='Squat', category='strength', muscle_group='legs', 
                    description='Leg compound exercise'),
            Exercise(name='Deadlift', category='strength', muscle_group='back', 
                    description='Back compound exercise'),
            Exercise(name='Pull-ups', category='strength', muscle_group='back', 
                    description='Bodyweight back exercise'),
            Exercise(name='Shoulder Press', category='strength', muscle_group='shoulders', 
                    description='Shoulder compound exercise'),
            Exercise(name='Bicep Curls', category='strength', muscle_group='arms', 
                    description='Isolation arm exercise'),
            Exercise(name='Tricep Dips', category='strength', muscle_group='arms', 
                    description='Tricep bodyweight exercise'),
            Exercise(name='Running', category='cardio', muscle_group=None, 
                    description='Cardio exercise'),
            Exercise(name='Cycling', category='cardio', muscle_group=None, 
                    description='Low impact cardio'),
            Exercise(name='Rowing', category='cardio', muscle_group=None, 
                    description='Full body cardio'),
            Exercise(name='Leg Press', category='strength', muscle_group='legs', 
                    description='Quad focused exercise'),
            Exercise(name='Lat Pulldown', category='strength', muscle_group='back', 
                    description='Back isolation exercise'),
            Exercise(name='Dumbbell Flyes', category='strength', muscle_group='chest', 
                    description='Chest isolation exercise'),
            Exercise(name='Lunges', category='strength', muscle_group='legs', 
                    description='Unilateral leg exercise'),
            Exercise(name='Plank', category='flexibility', muscle_group='core', 
                    description='Core stability exercise'),
        ]
        db.session.add_all(exercises)
        db.session.commit()
        print(f"✅ Created {len(exercises)} exercises")
        
        # Create Workouts
        print("Creating workouts...")
        today = datetime.now().date()
        
        workouts_data = [
            {'user': users[0], 'days_ago': 7, 'duration': 60, 'notes': 'Chest and triceps day'},
            {'user': users[0], 'days_ago': 5, 'duration': 45, 'notes': 'Leg day'},
            {'user': users[0], 'days_ago': 3, 'duration': 50, 'notes': 'Back and biceps'},
            {'user': users[0], 'days_ago': 1, 'duration': 40, 'notes': 'Cardio session'},
            {'user': users[1], 'days_ago': 6, 'duration': 55, 'notes': 'Full body workout'},
            {'user': users[1], 'days_ago': 2, 'duration': 35, 'notes': 'Light cardio'},
            {'user': users[0], 'days_ago': 10, 'duration': 65, 'notes': 'Heavy lifting day'},
            {'user': users[0], 'days_ago': 8, 'duration': 50, 'notes': 'Upper body focus'},
            {'user': users[1], 'days_ago': 9, 'duration': 45, 'notes': 'Lower body workout'},
            {'user': users[0], 'days_ago': 0, 'duration': 55, 'notes': 'Shoulders and core'},
        ]
        
        workouts = []
        for w_data in workouts_data:
            workout = Workout(
                user_id=w_data['user'].user_id,
                workout_date=today - timedelta(days=w_data['days_ago']),
                duration_minutes=w_data['duration'],
                notes=w_data['notes']
            )
            workouts.append(workout)
        
        db.session.add_all(workouts)
        db.session.commit()
        print(f"✅ Created {len(workouts)} workouts")
        
        # Create Workout Exercises (exercise logs)
        print("Creating workout exercise logs...")
        workout_exercises_data = [
            # Workout 1 - Chest and triceps
            {'workout': workouts[0], 'exercise': exercises[0], 'sets': 4, 'reps': 8, 'weight': 185},
            {'workout': workouts[0], 'exercise': exercises[12], 'sets': 3, 'reps': 12, 'weight': 35},
            {'workout': workouts[0], 'exercise': exercises[6], 'sets': 3, 'reps': 15, 'weight': None},
            
            # Workout 2 - Leg day
            {'workout': workouts[1], 'exercise': exercises[1], 'sets': 4, 'reps': 10, 'weight': 225},
            {'workout': workouts[1], 'exercise': exercises[10], 'sets': 3, 'reps': 12, 'weight': 300},
            {'workout': workouts[1], 'exercise': exercises[13], 'sets': 3, 'reps': 10, 'weight': 40},
            
            # Workout 3 - Back and biceps
            {'workout': workouts[2], 'exercise': exercises[2], 'sets': 4, 'reps': 6, 'weight': 275},
            {'workout': workouts[2], 'exercise': exercises[3], 'sets': 3, 'reps': 10, 'weight': None},
            {'workout': workouts[2], 'exercise': exercises[11], 'sets': 3, 'reps': 12, 'weight': 120},
            {'workout': workouts[2], 'exercise': exercises[5], 'sets': 3, 'reps': 12, 'weight': 35},
            
            # Workout 4 - Cardio
            {'workout': workouts[3], 'exercise': exercises[7], 'sets': 1, 'reps': None, 
             'weight': None, 'distance': 3.5, 'duration': 1800},
            {'workout': workouts[3], 'exercise': exercises[9], 'sets': 1, 'reps': None, 
             'weight': None, 'distance': None, 'duration': 600},
            
            # Workout 5 - Full body
            {'workout': workouts[4], 'exercise': exercises[1], 'sets': 3, 'reps': 12, 'weight': 155},
            {'workout': workouts[4], 'exercise': exercises[0], 'sets': 3, 'reps': 10, 'weight': 135},
            {'workout': workouts[4], 'exercise': exercises[3], 'sets': 3, 'reps': 8, 'weight': None},
            
            # Workout 6 - Light cardio
            {'workout': workouts[5], 'exercise': exercises[8], 'sets': 1, 'reps': None, 
             'weight': None, 'distance': 8, 'duration': 1500},
            
            # Workout 7 - Heavy lifting
            {'workout': workouts[6], 'exercise': exercises[2], 'sets': 5, 'reps': 5, 'weight': 315},
            {'workout': workouts[6], 'exercise': exercises[1], 'sets': 5, 'reps': 5, 'weight': 275},
            {'workout': workouts[6], 'exercise': exercises[0], 'sets': 5, 'reps': 5, 'weight': 225},
            
            # Workout 8 - Upper body
            {'workout': workouts[7], 'exercise': exercises[4], 'sets': 4, 'reps': 8, 'weight': 95},
            {'workout': workouts[7], 'exercise': exercises[11], 'sets': 3, 'reps': 12, 'weight': 110},
            {'workout': workouts[7], 'exercise': exercises[5], 'sets': 3, 'reps': 15, 'weight': 30},
            
            # Workout 9 - Lower body
            {'workout': workouts[8], 'exercise': exercises[1], 'sets': 4, 'reps': 8, 'weight': 185},
            {'workout': workouts[8], 'exercise': exercises[13], 'sets': 4, 'reps': 12, 'weight': 50},
            {'workout': workouts[8], 'exercise': exercises[10], 'sets': 3, 'reps': 15, 'weight': 280},
            
            # Workout 10 - Shoulders and core
            {'workout': workouts[9], 'exercise': exercises[4], 'sets': 4, 'reps': 10, 'weight': 85},
            {'workout': workouts[9], 'exercise': exercises[14], 'sets': 3, 'reps': None, 
             'weight': None, 'distance': None, 'duration': 60},
        ]
        
        workout_exercises = []
        for we_data in workout_exercises_data:
            we = WorkoutExercise(
                workout_id=we_data['workout'].workout_id,
                exercise_id=we_data['exercise'].exercise_id,
                sets=we_data['sets'],
                reps=we_data.get('reps'),
                weight_lbs=we_data.get('weight'),
                distance_miles=we_data.get('distance'),
                duration_seconds=we_data.get('duration')
            )
            workout_exercises.append(we)
        
        db.session.add_all(workout_exercises)
        db.session.commit()
        print(f"✅ Created {len(workout_exercises)} workout exercise logs")
        
        print("\n" + "="*50)
        print("🎉 Database seeded successfully!")
        print("="*50)
        print(f"\nSummary:")
        print(f"  Users: {len(users)}")
        print(f"  Exercises: {len(exercises)}")
        print(f"  Workouts: {len(workouts)}")
        print(f"  Exercise Logs: {len(workout_exercises)}")
        print(f"\nYou can now start the Flask server with: python app.py")


if __name__ == '__main__':
    seed_database()

