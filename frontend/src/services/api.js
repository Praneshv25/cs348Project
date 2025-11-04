// API Service Layer - Backend Integration
// This version connects to the Flask backend API

const API_BASE_URL = 'http://localhost:5001/api';

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || 'Request failed');
  }
  return response.json();
};

// ==================== EXERCISE API ====================

export const getAllExercises = async () => {
  const response = await fetch(`${API_BASE_URL}/exercises`);
  return handleResponse(response);
};

export const getExerciseById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/exercises/${id}`);
  return handleResponse(response);
};

export const createExercise = async (exerciseData) => {
  const response = await fetch(`${API_BASE_URL}/exercises`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(exerciseData),
  });
  return handleResponse(response);
};

export const updateExercise = async (id, exerciseData) => {
  const response = await fetch(`${API_BASE_URL}/exercises/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(exerciseData),
  });
  return handleResponse(response);
};

export const deleteExercise = async (id) => {
  const response = await fetch(`${API_BASE_URL}/exercises/${id}`, {
    method: 'DELETE',
  });
  return handleResponse(response);
};

// ==================== WORKOUT API ====================

export const getAllWorkouts = async () => {
  const response = await fetch(`${API_BASE_URL}/workouts`);
  return handleResponse(response);
};

export const getWorkoutById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/workouts/${id}`);
  return handleResponse(response);
};

export const createWorkout = async (workoutData) => {
  const response = await fetch(`${API_BASE_URL}/workouts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(workoutData),
  });
  return handleResponse(response);
};

export const updateWorkout = async (id, workoutData) => {
  const response = await fetch(`${API_BASE_URL}/workouts/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(workoutData),
  });
  return handleResponse(response);
};

export const deleteWorkout = async (id) => {
  const response = await fetch(`${API_BASE_URL}/workouts/${id}`, {
    method: 'DELETE',
  });
  return handleResponse(response);
};

// ==================== WORKOUT EXERCISE LOGS API ====================

export const createWorkoutExercise = async (logData) => {
  const response = await fetch(`${API_BASE_URL}/workout-exercises`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(logData),
  });
  return handleResponse(response);
};

export const deleteWorkoutExercise = async (logId) => {
  const response = await fetch(`${API_BASE_URL}/workout-exercises/${logId}`, {
    method: 'DELETE',
  });
  return handleResponse(response);
};

// ==================== REPORTS & FILTERING API ====================

export const getWorkoutReport = async (filters = {}) => {
  // Build query string from filters
  const params = new URLSearchParams();
  
  if (filters.startDate) params.append('startDate', filters.startDate);
  if (filters.endDate) params.append('endDate', filters.endDate);
  if (filters.category && filters.category !== 'all') params.append('category', filters.category);
  if (filters.minWeight !== undefined && filters.minWeight !== '') params.append('minWeight', filters.minWeight);
  if (filters.maxWeight !== undefined && filters.maxWeight !== '') params.append('maxWeight', filters.maxWeight);
  
  const queryString = params.toString();
  const url = queryString 
    ? `${API_BASE_URL}/reports/summary?${queryString}`
    : `${API_BASE_URL}/reports/summary`;
  
  const response = await fetch(url);
  return handleResponse(response);
};

// Get unique categories (for dynamic dropdown)
export const getExerciseCategories = async () => {
  const response = await fetch(`${API_BASE_URL}/categories`);
  return handleResponse(response);
};

// Get unique muscle groups (for dynamic dropdown)
export const getMuscleGroups = async () => {
  const response = await fetch(`${API_BASE_URL}/muscle-groups`);
  return handleResponse(response);
};

// Health check
export const checkHealth = async () => {
  const response = await fetch(`${API_BASE_URL}/health`);
  return handleResponse(response);
};

