import React, { useState, useEffect } from 'react';
import { 
  getAllExercises, 
  createWorkout, 
  createWorkoutExercise,
  getWorkoutById 
} from '../services/api';
import './WorkoutLogger.css';

const WorkoutLogger = () => {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(false);
  const [workoutData, setWorkoutData] = useState({
    user_id: 1, // Default user
    workout_date: new Date().toISOString().split('T')[0],
    duration_minutes: '',
    notes: ''
  });
  const [exerciseLogs, setExerciseLogs] = useState([]);
  const [currentLog, setCurrentLog] = useState({
    exercise_id: '',
    sets: '',
    reps: '',
    weight_lbs: '',
    distance_miles: '',
    duration_seconds: ''
  });
  const [message, setMessage] = useState({ text: '', type: '' });
  const [savedWorkout, setSavedWorkout] = useState(null);

  // Fetch exercises on mount - DYNAMIC LOADING (not hardcoded!)
  useEffect(() => {
    loadExercises();
  }, []);

  const loadExercises = async () => {
    setLoading(true);
    try {
      // This demonstrates dynamic data loading for the dropdown
      const data = await getAllExercises();
      setExercises(data);
    } catch (error) {
      showMessage('Error loading exercises', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  const handleWorkoutChange = (e) => {
    const { name, value } = e.target;
    setWorkoutData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogChange = (e) => {
    const { name, value } = e.target;
    setCurrentLog(prev => ({ ...prev, [name]: value }));
  };

  const getSelectedExercise = () => {
    return exercises.find(ex => ex.exercise_id === parseInt(currentLog.exercise_id));
  };

  const addExerciseLog = () => {
    if (!currentLog.exercise_id) {
      showMessage('Please select an exercise', 'error');
      return;
    }

    const exercise = getSelectedExercise();
    const newLog = {
      exercise_id: parseInt(currentLog.exercise_id),
      exercise_name: exercise.name,
      exercise_category: exercise.category,
      sets: parseInt(currentLog.sets) || null,
      reps: parseInt(currentLog.reps) || null,
      weight_lbs: parseFloat(currentLog.weight_lbs) || null,
      distance_miles: parseFloat(currentLog.distance_miles) || null,
      duration_seconds: parseInt(currentLog.duration_seconds) || null
    };

    setExerciseLogs(prev => [...prev, newLog]);
    
    // Reset current log
    setCurrentLog({
      exercise_id: '',
      sets: '',
      reps: '',
      weight_lbs: '',
      distance_miles: '',
      duration_seconds: ''
    });
    
    showMessage('Exercise added to workout!', 'success');
  };

  const removeExerciseLog = (index) => {
    setExerciseLogs(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (exerciseLogs.length === 0) {
      showMessage('Please add at least one exercise to the workout', 'error');
      return;
    }

    setLoading(true);
    try {
      // Create the workout
      const workout = await createWorkout({
        user_id: workoutData.user_id,
        workout_date: workoutData.workout_date,
        duration_minutes: parseInt(workoutData.duration_minutes) || null,
        notes: workoutData.notes
      });

      // Create all exercise logs
      for (const log of exerciseLogs) {
        await createWorkoutExercise({
          workout_id: workout.workout_id,
          exercise_id: log.exercise_id,
          sets: log.sets,
          reps: log.reps,
          weight_lbs: log.weight_lbs,
          distance_miles: log.distance_miles,
          duration_seconds: log.duration_seconds
        });
      }

      // Load the complete workout to display
      const completeWorkout = await getWorkoutById(workout.workout_id);
      setSavedWorkout(completeWorkout);
      
      showMessage('Workout saved successfully!', 'success');
      
      // Reset form
      setWorkoutData({
        user_id: 1,
        workout_date: new Date().toISOString().split('T')[0],
        duration_minutes: '',
        notes: ''
      });
      setExerciseLogs([]);
      
      // Scroll to saved workout
      setTimeout(() => {
        document.getElementById('saved-workout')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (error) {
      showMessage('Error saving workout', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="workout-logger">
      <h1>Workout Logger</h1>
      <p className="subtitle">Log your workouts with dynamic exercise selection</p>

      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Workout Details */}
        <div className="form-section">
          <h2>Workout Details</h2>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="workout_date">Date *</label>
              <input
                type="date"
                id="workout_date"
                name="workout_date"
                value={workoutData.workout_date}
                onChange={handleWorkoutChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="duration_minutes">Duration (minutes)</label>
              <input
                type="number"
                id="duration_minutes"
                name="duration_minutes"
                value={workoutData.duration_minutes}
                onChange={handleWorkoutChange}
                placeholder="e.g., 60"
                min="1"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              name="notes"
              value={workoutData.notes}
              onChange={handleWorkoutChange}
              placeholder="Any notes about this workout..."
              rows="2"
            />
          </div>
        </div>

        {/* Exercise Selection - DYNAMICALLY POPULATED */}
        <div className="form-section">
          <h2>Add Exercises</h2>
          <div className="exercise-input-section">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="exercise_id">
                  Exercise * 
                  <span className="dynamic-indicator"> (Loaded Dynamically)</span>
                </label>
                <select
                  id="exercise_id"
                  name="exercise_id"
                  value={currentLog.exercise_id}
                  onChange={handleLogChange}
                  disabled={loading}
                >
                  <option value="">-- Select Exercise --</option>
                  {/* IMPORTANT: This dropdown is built dynamically from database! */}
                  {exercises.map(exercise => (
                    <option key={exercise.exercise_id} value={exercise.exercise_id}>
                      {exercise.name} ({exercise.category})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="sets">Sets</label>
                <input
                  type="number"
                  id="sets"
                  name="sets"
                  value={currentLog.sets}
                  onChange={handleLogChange}
                  placeholder="e.g., 3"
                  min="1"
                />
              </div>

              <div className="form-group">
                <label htmlFor="reps">Reps</label>
                <input
                  type="number"
                  id="reps"
                  name="reps"
                  value={currentLog.reps}
                  onChange={handleLogChange}
                  placeholder="e.g., 10"
                  min="1"
                />
              </div>

              <div className="form-group">
                <label htmlFor="weight_lbs">Weight (lbs)</label>
                <input
                  type="number"
                  id="weight_lbs"
                  name="weight_lbs"
                  value={currentLog.weight_lbs}
                  onChange={handleLogChange}
                  placeholder="e.g., 185"
                  step="0.5"
                  min="0"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="distance_miles">Distance (miles)</label>
                <input
                  type="number"
                  id="distance_miles"
                  name="distance_miles"
                  value={currentLog.distance_miles}
                  onChange={handleLogChange}
                  placeholder="For cardio"
                  step="0.1"
                  min="0"
                />
              </div>

              <div className="form-group">
                <label htmlFor="duration_seconds">Duration (seconds)</label>
                <input
                  type="number"
                  id="duration_seconds"
                  name="duration_seconds"
                  value={currentLog.duration_seconds}
                  onChange={handleLogChange}
                  placeholder="For timed exercises"
                  min="0"
                />
              </div>
            </div>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={addExerciseLog}
              disabled={loading}
            >
              Add Exercise to Workout
            </button>
          </div>
        </div>

        {/* Current Workout Exercises */}
        {exerciseLogs.length > 0 && (
          <div className="form-section">
            <h2>Exercises in This Workout ({exerciseLogs.length})</h2>
            <div className="exercise-list">
              {exerciseLogs.map((log, index) => (
                <div key={index} className="exercise-item">
                  <div className="exercise-item-header">
                    <h3>{log.exercise_name}</h3>
                    <button
                      type="button"
                      className="btn-remove"
                      onClick={() => removeExerciseLog(index)}
                    >
                      Remove
                    </button>
                  </div>
                  <div className="exercise-item-details">
                    {log.sets && <span>Sets: {log.sets}</span>}
                    {log.reps && <span>Reps: {log.reps}</span>}
                    {log.weight_lbs && <span>Weight: {log.weight_lbs} lbs</span>}
                    {log.distance_miles && <span>Distance: {log.distance_miles} miles</span>}
                    {log.duration_seconds && <span>Duration: {log.duration_seconds}s</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="form-actions">
          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={loading || exerciseLogs.length === 0}
          >
            Save Workout
          </button>
        </div>
      </form>

      {/* Last Saved Workout */}
      {savedWorkout && (
        <div className="saved-workout" id="saved-workout">
          <h2>✅ Last Saved Workout</h2>
          <div className="workout-details">
            <p><strong>Date:</strong> {savedWorkout.workout_date}</p>
            <p><strong>Duration:</strong> {savedWorkout.duration_minutes} minutes</p>
            {savedWorkout.notes && <p><strong>Notes:</strong> {savedWorkout.notes}</p>}
            
            <h3>Exercises:</h3>
            <ul>
              {savedWorkout.exercises.map((ex, idx) => (
                <li key={idx}>
                  <strong>{ex.exercise_name}</strong>
                  {ex.sets && ex.reps && ` - ${ex.sets} sets × ${ex.reps} reps`}
                  {ex.weight_lbs && ` @ ${ex.weight_lbs} lbs`}
                  {ex.distance_miles && ` - ${ex.distance_miles} miles`}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Demo Notes */}
      <div className="demo-notes">
        <h3>📝 Demo Notes - Dynamic UI Components</h3>
        <ul>
          <li>✅ <strong>Exercise dropdown is populated dynamically</strong> from the database (not hardcoded!)</li>
          <li>✅ The <code>getAllExercises()</code> API call fetches all exercises</li>
          <li>✅ The dropdown is built using <code>exercises.map()</code> over the fetched data</li>
          <li>✅ If new exercises are added in Exercise Manager, they appear here automatically</li>
        </ul>
        <div className="code-preview">
          <strong>Code snippet:</strong>
          <pre>{`// Dynamic dropdown population
const [exercises, setExercises] = useState([]);

useEffect(() => {
  const loadExercises = async () => {
    const data = await getAllExercises();
    setExercises(data);  // NOT hardcoded!
  };
  loadExercises();
}, []);

// Render dropdown
<select>
  {exercises.map(ex => (
    <option key={ex.exercise_id} value={ex.exercise_id}>
      {ex.name}
    </option>
  ))}
</select>`}</pre>
        </div>
      </div>
    </div>
  );
};

export default WorkoutLogger;

