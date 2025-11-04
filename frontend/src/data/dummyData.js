// Dummy data for the workout tracker application
// This simulates data that would come from the database

// Exercise types - This will be fetched dynamically (not hardcoded in UI!)
export const exercises = [
  { exercise_id: 1, name: 'Bench Press', category: 'strength', muscle_group: 'chest', description: 'Chest compound exercise' },
  { exercise_id: 2, name: 'Squat', category: 'strength', muscle_group: 'legs', description: 'Leg compound exercise' },
  { exercise_id: 3, name: 'Deadlift', category: 'strength', muscle_group: 'back', description: 'Back compound exercise' },
  { exercise_id: 4, name: 'Pull-ups', category: 'strength', muscle_group: 'back', description: 'Bodyweight back exercise' },
  { exercise_id: 5, name: 'Shoulder Press', category: 'strength', muscle_group: 'shoulders', description: 'Shoulder compound exercise' },
  { exercise_id: 6, name: 'Bicep Curls', category: 'strength', muscle_group: 'arms', description: 'Isolation arm exercise' },
  { exercise_id: 7, name: 'Tricep Dips', category: 'strength', muscle_group: 'arms', description: 'Tricep bodyweight exercise' },
  { exercise_id: 8, name: 'Running', category: 'cardio', muscle_group: null, description: 'Cardio exercise' },
  { exercise_id: 9, name: 'Cycling', category: 'cardio', muscle_group: null, description: 'Low impact cardio' },
  { exercise_id: 10, name: 'Rowing', category: 'cardio', muscle_group: null, description: 'Full body cardio' },
  { exercise_id: 11, name: 'Leg Press', category: 'strength', muscle_group: 'legs', description: 'Quad focused exercise' },
  { exercise_id: 12, name: 'Lat Pulldown', category: 'strength', muscle_group: 'back', description: 'Back isolation exercise' },
  { exercise_id: 13, name: 'Dumbbell Flyes', category: 'strength', muscle_group: 'chest', description: 'Chest isolation exercise' },
  { exercise_id: 14, name: 'Lunges', category: 'strength', muscle_group: 'legs', description: 'Unilateral leg exercise' },
  { exercise_id: 15, name: 'Plank', category: 'flexibility', muscle_group: 'core', description: 'Core stability exercise' },
];

// Users
export const users = [
  { user_id: 1, username: 'john_doe', email: 'john@example.com', created_at: '2024-01-15' },
  { user_id: 2, username: 'jane_smith', email: 'jane@example.com', created_at: '2024-02-20' },
  { user_id: 3, username: 'mike_wilson', email: 'mike@example.com', created_at: '2024-03-10' },
];

// Workout sessions
export const workouts = [
  { workout_id: 1, user_id: 1, workout_date: '2025-10-28', duration_minutes: 60, notes: 'Chest and triceps day' },
  { workout_id: 2, user_id: 1, workout_date: '2025-10-30', duration_minutes: 45, notes: 'Leg day' },
  { workout_id: 3, user_id: 1, workout_date: '2025-11-01', duration_minutes: 50, notes: 'Back and biceps' },
  { workout_id: 4, user_id: 1, workout_date: '2025-11-03', duration_minutes: 40, notes: 'Cardio session' },
  { workout_id: 5, user_id: 2, workout_date: '2025-10-29', duration_minutes: 55, notes: 'Full body workout' },
  { workout_id: 6, user_id: 2, workout_date: '2025-11-02', duration_minutes: 35, notes: 'Light cardio' },
  { workout_id: 7, user_id: 1, workout_date: '2025-10-25', duration_minutes: 65, notes: 'Heavy lifting day' },
  { workout_id: 8, user_id: 1, workout_date: '2025-10-27', duration_minutes: 50, notes: 'Upper body focus' },
  { workout_id: 9, user_id: 2, workout_date: '2025-10-26', duration_minutes: 45, notes: 'Lower body workout' },
  { workout_id: 10, user_id: 1, workout_date: '2025-11-04', duration_minutes: 55, notes: 'Shoulders and core' },
];

// Individual exercise logs (what exercises were done in each workout)
export const workoutExercises = [
  // Workout 1 - Chest and triceps
  { log_id: 1, workout_id: 1, exercise_id: 1, sets: 4, reps: 8, weight_lbs: 185, distance_miles: null, duration_seconds: null },
  { log_id: 2, workout_id: 1, exercise_id: 13, sets: 3, reps: 12, weight_lbs: 35, distance_miles: null, duration_seconds: null },
  { log_id: 3, workout_id: 1, exercise_id: 7, sets: 3, reps: 15, weight_lbs: null, distance_miles: null, duration_seconds: null },
  
  // Workout 2 - Leg day
  { log_id: 4, workout_id: 2, exercise_id: 2, sets: 4, reps: 10, weight_lbs: 225, distance_miles: null, duration_seconds: null },
  { log_id: 5, workout_id: 2, exercise_id: 11, sets: 3, reps: 12, weight_lbs: 300, distance_miles: null, duration_seconds: null },
  { log_id: 6, workout_id: 2, exercise_id: 14, sets: 3, reps: 10, weight_lbs: 40, distance_miles: null, duration_seconds: null },
  
  // Workout 3 - Back and biceps
  { log_id: 7, workout_id: 3, exercise_id: 3, sets: 4, reps: 6, weight_lbs: 275, distance_miles: null, duration_seconds: null },
  { log_id: 8, workout_id: 3, exercise_id: 4, sets: 3, reps: 10, weight_lbs: null, distance_miles: null, duration_seconds: null },
  { log_id: 9, workout_id: 3, exercise_id: 12, sets: 3, reps: 12, weight_lbs: 120, distance_miles: null, duration_seconds: null },
  { log_id: 10, workout_id: 3, exercise_id: 6, sets: 3, reps: 12, weight_lbs: 35, distance_miles: null, duration_seconds: null },
  
  // Workout 4 - Cardio
  { log_id: 11, workout_id: 4, exercise_id: 8, sets: 1, reps: null, weight_lbs: null, distance_miles: 3.5, duration_seconds: 1800 },
  { log_id: 12, workout_id: 4, exercise_id: 10, sets: 1, reps: null, weight_lbs: null, distance_miles: null, duration_seconds: 600 },
  
  // Workout 5 - Full body
  { log_id: 13, workout_id: 5, exercise_id: 2, sets: 3, reps: 12, weight_lbs: 155, distance_miles: null, duration_seconds: null },
  { log_id: 14, workout_id: 5, exercise_id: 1, sets: 3, reps: 10, weight_lbs: 135, distance_miles: null, duration_seconds: null },
  { log_id: 15, workout_id: 5, exercise_id: 4, sets: 3, reps: 8, weight_lbs: null, distance_miles: null, duration_seconds: null },
  
  // Workout 6 - Light cardio
  { log_id: 16, workout_id: 6, exercise_id: 9, sets: 1, reps: null, weight_lbs: null, distance_miles: 8, duration_seconds: 1500 },
  
  // Workout 7 - Heavy lifting
  { log_id: 17, workout_id: 7, exercise_id: 3, sets: 5, reps: 5, weight_lbs: 315, distance_miles: null, duration_seconds: null },
  { log_id: 18, workout_id: 7, exercise_id: 2, sets: 5, reps: 5, weight_lbs: 275, distance_miles: null, duration_seconds: null },
  { log_id: 19, workout_id: 7, exercise_id: 1, sets: 5, reps: 5, weight_lbs: 225, distance_miles: null, duration_seconds: null },
  
  // Workout 8 - Upper body
  { log_id: 20, workout_id: 8, exercise_id: 5, sets: 4, reps: 8, weight_lbs: 95, distance_miles: null, duration_seconds: null },
  { log_id: 21, workout_id: 8, exercise_id: 12, sets: 3, reps: 12, weight_lbs: 110, distance_miles: null, duration_seconds: null },
  { log_id: 22, workout_id: 8, exercise_id: 6, sets: 3, reps: 15, weight_lbs: 30, distance_miles: null, duration_seconds: null },
  
  // Workout 9 - Lower body
  { log_id: 23, workout_id: 9, exercise_id: 2, sets: 4, reps: 8, weight_lbs: 185, distance_miles: null, duration_seconds: null },
  { log_id: 24, workout_id: 9, exercise_id: 14, sets: 4, reps: 12, weight_lbs: 50, distance_miles: null, duration_seconds: null },
  { log_id: 25, workout_id: 9, exercise_id: 11, sets: 3, reps: 15, weight_lbs: 280, distance_miles: null, duration_seconds: null },
  
  // Workout 10 - Shoulders and core
  { log_id: 26, workout_id: 10, exercise_id: 5, sets: 4, reps: 10, weight_lbs: 85, distance_miles: null, duration_seconds: null },
  { log_id: 27, workout_id: 10, exercise_id: 15, sets: 3, reps: null, weight_lbs: null, distance_miles: null, duration_seconds: 60 },
];

// Helper function to get the next ID
export const getNextId = (array, idField) => {
  if (array.length === 0) return 1;
  return Math.max(...array.map(item => item[idField])) + 1;
};

