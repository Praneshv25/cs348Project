// API Service Layer
// Currently using dummy data, but structured to easily switch to real backend API calls

import { 
  exercises as initialExercises, 
  workouts as initialWorkouts,
  workoutExercises as initialWorkoutExercises,
  getNextId 
} from '../data/dummyData';

// In-memory data storage (simulates database)
let exercises = [...initialExercises];
let workouts = [...initialWorkouts];
let workoutExercises = [...initialWorkoutExercises];

// Simulate network delay
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

// ==================== EXERCISE API ====================

export const getAllExercises = async () => {
  await delay();
  return [...exercises];
};

export const getExerciseById = async (id) => {
  await delay();
  return exercises.find(ex => ex.exercise_id === id);
};

export const createExercise = async (exerciseData) => {
  await delay();
  const newExercise = {
    exercise_id: getNextId(exercises, 'exercise_id'),
    ...exerciseData,
    created_at: new Date().toISOString()
  };
  exercises.push(newExercise);
  return newExercise;
};

export const updateExercise = async (id, exerciseData) => {
  await delay();
  const index = exercises.findIndex(ex => ex.exercise_id === id);
  if (index === -1) throw new Error('Exercise not found');
  
  exercises[index] = { ...exercises[index], ...exerciseData };
  return exercises[index];
};

export const deleteExercise = async (id) => {
  await delay();
  const index = exercises.findIndex(ex => ex.exercise_id === id);
  if (index === -1) throw new Error('Exercise not found');
  
  exercises.splice(index, 1);
  // Also delete associated workout exercises
  workoutExercises = workoutExercises.filter(we => we.exercise_id !== id);
  return { success: true };
};

// ==================== WORKOUT API ====================

export const getAllWorkouts = async () => {
  await delay();
  return [...workouts];
};

export const getWorkoutById = async (id) => {
  await delay();
  const workout = workouts.find(w => w.workout_id === id);
  if (!workout) return null;
  
  // Get associated exercises
  const exerciseLogs = workoutExercises.filter(we => we.workout_id === id);
  const exerciseDetails = exerciseLogs.map(log => {
    const exercise = exercises.find(ex => ex.exercise_id === log.exercise_id);
    return {
      ...log,
      exercise_name: exercise?.name,
      exercise_category: exercise?.category
    };
  });
  
  return {
    ...workout,
    exercises: exerciseDetails
  };
};

export const createWorkout = async (workoutData) => {
  await delay();
  const newWorkout = {
    workout_id: getNextId(workouts, 'workout_id'),
    ...workoutData,
    workout_date: workoutData.workout_date || new Date().toISOString().split('T')[0]
  };
  workouts.push(newWorkout);
  return newWorkout;
};

export const updateWorkout = async (id, workoutData) => {
  await delay();
  const index = workouts.findIndex(w => w.workout_id === id);
  if (index === -1) throw new Error('Workout not found');
  
  workouts[index] = { ...workouts[index], ...workoutData };
  return workouts[index];
};

export const deleteWorkout = async (id) => {
  await delay();
  const index = workouts.findIndex(w => w.workout_id === id);
  if (index === -1) throw new Error('Workout not found');
  
  workouts.splice(index, 1);
  // Delete associated exercise logs
  workoutExercises = workoutExercises.filter(we => we.workout_id !== id);
  return { success: true };
};

// ==================== WORKOUT EXERCISE LOGS API ====================

export const createWorkoutExercise = async (logData) => {
  await delay();
  const newLog = {
    log_id: getNextId(workoutExercises, 'log_id'),
    ...logData
  };
  workoutExercises.push(newLog);
  return newLog;
};

export const deleteWorkoutExercise = async (logId) => {
  await delay();
  const index = workoutExercises.findIndex(we => we.log_id === logId);
  if (index === -1) throw new Error('Workout exercise not found');
  
  workoutExercises.splice(index, 1);
  return { success: true };
};

// ==================== REPORTS & FILTERING API ====================

export const getWorkoutReport = async (filters = {}) => {
  await delay();
  
  const { startDate, endDate, category, minWeight, maxWeight } = filters;
  
  // Filter workouts by date
  let filteredWorkouts = [...workouts];
  if (startDate) {
    filteredWorkouts = filteredWorkouts.filter(w => w.workout_date >= startDate);
  }
  if (endDate) {
    filteredWorkouts = filteredWorkouts.filter(w => w.workout_date <= endDate);
  }
  
  // Get workout IDs
  const workoutIds = filteredWorkouts.map(w => w.workout_id);
  
  // Filter workout exercises
  let filteredLogs = workoutExercises.filter(we => workoutIds.includes(we.workout_id));
  
  // Filter by category
  if (category && category !== 'all') {
    const categoryExerciseIds = exercises
      .filter(ex => ex.category === category)
      .map(ex => ex.exercise_id);
    filteredLogs = filteredLogs.filter(we => categoryExerciseIds.includes(we.exercise_id));
  }
  
  // Filter by weight
  if (minWeight !== undefined && minWeight !== '') {
    filteredLogs = filteredLogs.filter(we => we.weight_lbs >= parseFloat(minWeight));
  }
  if (maxWeight !== undefined && maxWeight !== '') {
    filteredLogs = filteredLogs.filter(we => we.weight_lbs <= parseFloat(maxWeight));
  }
  
  // Calculate statistics
  const totalWorkouts = filteredWorkouts.length;
  const totalSets = filteredLogs.reduce((sum, log) => sum + (log.sets || 0), 0);
  const totalReps = filteredLogs.reduce((sum, log) => sum + (log.sets * log.reps || 0), 0);
  
  const weightsUsed = filteredLogs
    .filter(log => log.weight_lbs)
    .map(log => log.weight_lbs);
  const avgWeight = weightsUsed.length > 0 
    ? weightsUsed.reduce((a, b) => a + b, 0) / weightsUsed.length 
    : 0;
  
  // Exercise breakdown
  const exerciseBreakdown = {};
  filteredLogs.forEach(log => {
    const exercise = exercises.find(ex => ex.exercise_id === log.exercise_id);
    if (exercise) {
      if (!exerciseBreakdown[exercise.name]) {
        exerciseBreakdown[exercise.name] = { count: 0, totalSets: 0, totalReps: 0 };
      }
      exerciseBreakdown[exercise.name].count++;
      exerciseBreakdown[exercise.name].totalSets += log.sets || 0;
      exerciseBreakdown[exercise.name].totalReps += (log.sets * log.reps) || 0;
    }
  });
  
  // Get detailed workout list
  const detailedWorkouts = filteredWorkouts.map(workout => {
    const logs = filteredLogs.filter(we => we.workout_id === workout.workout_id);
    const exerciseDetails = logs.map(log => {
      const exercise = exercises.find(ex => ex.exercise_id === log.exercise_id);
      return {
        ...log,
        exercise_name: exercise?.name,
        exercise_category: exercise?.category
      };
    });
    
    return {
      ...workout,
      exercises: exerciseDetails
    };
  });
  
  return {
    summary: {
      totalWorkouts,
      totalSets,
      totalReps,
      avgWeight: avgWeight.toFixed(1),
      exerciseBreakdown
    },
    workouts: detailedWorkouts
  };
};

// Get unique categories (for dynamic dropdown)
export const getExerciseCategories = async () => {
  await delay();
  const categories = [...new Set(exercises.map(ex => ex.category))];
  return categories;
};

// Get unique muscle groups (for dynamic dropdown)
export const getMuscleGroups = async () => {
  await delay();
  const muscleGroups = [...new Set(exercises.map(ex => ex.muscle_group).filter(Boolean))];
  return muscleGroups;
};

// Reset data to initial state (useful for demo)
export const resetData = () => {
  exercises = [...initialExercises];
  workouts = [...initialWorkouts];
  workoutExercises = [...initialWorkoutExercises];
};

