from flask import Blueprint, request, jsonify
from models import db, Exercise, Workout, WorkoutExercise, User
from datetime import datetime
from sqlalchemy import func

api = Blueprint('api', __name__, url_prefix='/api')

# ==================== EXERCISE ROUTES ====================

@api.route('/exercises', methods=['GET'])
def get_exercises():
    """Get all exercises - used for dynamic dropdowns"""
    try:
        exercises = Exercise.query.all()
        return jsonify([ex.to_dict() for ex in exercises]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@api.route('/exercises/<int:exercise_id>', methods=['GET'])
def get_exercise(exercise_id):
    """Get a specific exercise by ID"""
    try:
        exercise = Exercise.query.get_or_404(exercise_id)
        return jsonify(exercise.to_dict()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 404


@api.route('/exercises', methods=['POST'])
def create_exercise():
    """Create a new exercise"""
    try:
        data = request.get_json()
        
        # Validation
        if not data.get('name') or not data.get('category'):
            return jsonify({'error': 'Name and category are required'}), 400
        
        # Check for duplicate name
        existing = Exercise.query.filter_by(name=data['name']).first()
        if existing:
            return jsonify({'error': 'Exercise with this name already exists'}), 400
        
        exercise = Exercise(
            name=data['name'],
            category=data['category'],
            muscle_group=data.get('muscle_group'),
            description=data.get('description')
        )
        
        db.session.add(exercise)
        db.session.commit()
        
        return jsonify(exercise.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@api.route('/exercises/<int:exercise_id>', methods=['PUT'])
def update_exercise(exercise_id):
    """Update an existing exercise"""
    try:
        exercise = Exercise.query.get_or_404(exercise_id)
        data = request.get_json()
        
        # Update fields
        if 'name' in data:
            # Check for duplicate name (excluding current exercise)
            existing = Exercise.query.filter(
                Exercise.name == data['name'],
                Exercise.exercise_id != exercise_id
            ).first()
            if existing:
                return jsonify({'error': 'Exercise with this name already exists'}), 400
            exercise.name = data['name']
        
        if 'category' in data:
            exercise.category = data['category']
        if 'muscle_group' in data:
            exercise.muscle_group = data['muscle_group']
        if 'description' in data:
            exercise.description = data['description']
        
        db.session.commit()
        return jsonify(exercise.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@api.route('/exercises/<int:exercise_id>', methods=['DELETE'])
def delete_exercise(exercise_id):
    """Delete an exercise"""
    try:
        exercise = Exercise.query.get_or_404(exercise_id)
        db.session.delete(exercise)
        db.session.commit()
        return jsonify({'success': True, 'message': 'Exercise deleted'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


# ==================== WORKOUT ROUTES ====================

@api.route('/workouts', methods=['GET'])
def get_workouts():
    """Get all workouts"""
    try:
        workouts = Workout.query.order_by(Workout.workout_date.desc()).all()
        return jsonify([w.to_dict() for w in workouts]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@api.route('/workouts/<int:workout_id>', methods=['GET'])
def get_workout(workout_id):
    """Get a specific workout with exercises"""
    try:
        workout = Workout.query.get_or_404(workout_id)
        return jsonify(workout.to_dict(include_exercises=True)), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 404


@api.route('/workouts', methods=['POST'])
def create_workout():
    """Create a new workout"""
    try:
        data = request.get_json()
        
        # Validation
        if not data.get('user_id') or not data.get('workout_date'):
            return jsonify({'error': 'User ID and workout date are required'}), 400
        
        # Parse date
        workout_date = datetime.strptime(data['workout_date'], '%Y-%m-%d').date()
        
        workout = Workout(
            user_id=data['user_id'],
            workout_date=workout_date,
            duration_minutes=data.get('duration_minutes'),
            notes=data.get('notes')
        )
        
        db.session.add(workout)
        db.session.commit()
        
        return jsonify(workout.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@api.route('/workouts/<int:workout_id>', methods=['PUT'])
def update_workout(workout_id):
    """Update an existing workout"""
    try:
        workout = Workout.query.get_or_404(workout_id)
        data = request.get_json()
        
        if 'workout_date' in data:
            workout.workout_date = datetime.strptime(data['workout_date'], '%Y-%m-%d').date()
        if 'duration_minutes' in data:
            workout.duration_minutes = data['duration_minutes']
        if 'notes' in data:
            workout.notes = data['notes']
        
        db.session.commit()
        return jsonify(workout.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@api.route('/workouts/<int:workout_id>', methods=['DELETE'])
def delete_workout(workout_id):
    """Delete a workout (cascades to workout_exercises)"""
    try:
        workout = Workout.query.get_or_404(workout_id)
        db.session.delete(workout)
        db.session.commit()
        return jsonify({'success': True, 'message': 'Workout deleted'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


# ==================== WORKOUT EXERCISE ROUTES ====================

@api.route('/workout-exercises', methods=['POST'])
def create_workout_exercise():
    """Log an exercise in a workout"""
    try:
        data = request.get_json()
        
        # Validation
        if not data.get('workout_id') or not data.get('exercise_id'):
            return jsonify({'error': 'Workout ID and Exercise ID are required'}), 400
        
        workout_exercise = WorkoutExercise(
            workout_id=data['workout_id'],
            exercise_id=data['exercise_id'],
            sets=data.get('sets'),
            reps=data.get('reps'),
            weight_lbs=data.get('weight_lbs'),
            distance_miles=data.get('distance_miles'),
            duration_seconds=data.get('duration_seconds')
        )
        
        db.session.add(workout_exercise)
        db.session.commit()
        
        return jsonify(workout_exercise.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@api.route('/workout-exercises/<int:log_id>', methods=['DELETE'])
def delete_workout_exercise(log_id):
    """Delete a workout exercise log"""
    try:
        workout_exercise = WorkoutExercise.query.get_or_404(log_id)
        db.session.delete(workout_exercise)
        db.session.commit()
        return jsonify({'success': True, 'message': 'Workout exercise deleted'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


# ==================== REPORT & FILTERING ROUTES ====================

@api.route('/reports/summary', methods=['GET'])
def get_workout_report():
    """Get workout report with filtering"""
    try:
        # Get query parameters
        start_date = request.args.get('startDate')
        end_date = request.args.get('endDate')
        category = request.args.get('category')
        min_weight = request.args.get('minWeight')
        max_weight = request.args.get('maxWeight')
        
        # Base query for workouts
        workout_query = Workout.query
        
        # Apply date filters
        if start_date:
            workout_query = workout_query.filter(Workout.workout_date >= start_date)
        if end_date:
            workout_query = workout_query.filter(Workout.workout_date <= end_date)
        
        workouts = workout_query.all()
        workout_ids = [w.workout_id for w in workouts]
        
        # Base query for workout exercises
        we_query = WorkoutExercise.query.filter(WorkoutExercise.workout_id.in_(workout_ids))
        
        # Apply category filter
        if category and category != 'all':
            we_query = we_query.join(Exercise).filter(Exercise.category == category)
        
        # Apply weight filters
        if min_weight:
            we_query = we_query.filter(WorkoutExercise.weight_lbs >= float(min_weight))
        if max_weight:
            we_query = we_query.filter(WorkoutExercise.weight_lbs <= float(max_weight))
        
        workout_exercises = we_query.all()
        
        # Calculate statistics
        total_workouts = len(workouts)
        total_sets = sum(we.sets or 0 for we in workout_exercises)
        total_reps = sum((we.sets or 0) * (we.reps or 0) for we in workout_exercises)
        
        weights = [we.weight_lbs for we in workout_exercises if we.weight_lbs]
        avg_weight = sum(weights) / len(weights) if weights else 0
        
        # Exercise breakdown
        exercise_breakdown = {}
        for we in workout_exercises:
            name = we.exercise.name
            if name not in exercise_breakdown:
                exercise_breakdown[name] = {'count': 0, 'totalSets': 0, 'totalReps': 0}
            exercise_breakdown[name]['count'] += 1
            exercise_breakdown[name]['totalSets'] += we.sets or 0
            exercise_breakdown[name]['totalReps'] += (we.sets or 0) * (we.reps or 0)
        
        # Get detailed workouts
        detailed_workouts = []
        for workout in workouts:
            # Filter workout exercises based on the same criteria
            filtered_we = [we for we in workout.workout_exercises if we in workout_exercises]
            if filtered_we or not (category or min_weight or max_weight):
                workout_dict = workout.to_dict()
                workout_dict['exercises'] = [we.to_dict() for we in filtered_we]
                detailed_workouts.append(workout_dict)
        
        return jsonify({
            'summary': {
                'totalWorkouts': total_workouts,
                'totalSets': total_sets,
                'totalReps': total_reps,
                'avgWeight': f'{avg_weight:.1f}',
                'exerciseBreakdown': exercise_breakdown
            },
            'workouts': detailed_workouts
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@api.route('/categories', methods=['GET'])
def get_categories():
    """Get unique exercise categories - for dynamic dropdowns"""
    try:
        categories = db.session.query(Exercise.category).distinct().all()
        return jsonify([cat[0] for cat in categories]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@api.route('/muscle-groups', methods=['GET'])
def get_muscle_groups():
    """Get unique muscle groups - for dynamic dropdowns"""
    try:
        muscle_groups = db.session.query(Exercise.muscle_group).filter(
            Exercise.muscle_group.isnot(None)
        ).distinct().all()
        return jsonify([mg[0] for mg in muscle_groups]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ==================== USER ROUTES (Optional) ====================

@api.route('/users', methods=['GET'])
def get_users():
    """Get all users"""
    try:
        users = User.query.all()
        return jsonify([u.to_dict() for u in users]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@api.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    """Get a specific user"""
    try:
        user = User.query.get_or_404(user_id)
        return jsonify(user.to_dict()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 404


# ==================== HEALTH CHECK ====================

@api.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'database': 'connected'
    }), 200

