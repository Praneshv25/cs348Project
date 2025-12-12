import React, { useState, useEffect } from 'react';
import { 
  getAllExercises, 
  createExercise, 
  updateExercise, 
  deleteExercise 
} from '../services/api';
import './ExerciseManager.css';

const ExerciseManager = () => {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'strength',
    muscle_group: '',
    description: ''
  });
  const [message, setMessage] = useState({ text: '', type: '' });

  // Fetch exercises on component mount
  useEffect(() => {
    loadExercises();
  }, []);

  const loadExercises = async () => {
    setLoading(true);
    try {
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      showMessage('Exercise name is required', 'error');
      return;
    }

    setLoading(true);
    try {
      if (editingId) {
        // UPDATE
        await updateExercise(editingId, formData);
        showMessage('Exercise updated successfully!', 'success');
        setEditingId(null);
      } else {
        // CREATE
        await createExercise(formData);
        showMessage('Exercise created successfully!', 'success');
      }
      
      // Reset form and reload data
      setFormData({
        name: '',
        category: 'strength',
        muscle_group: '',
        description: ''
      });
      await loadExercises();
    } catch (error) {
      showMessage('Error saving exercise', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (exercise) => {
    setEditingId(exercise.exercise_id);
    setFormData({
      name: exercise.name,
      category: exercise.category,
      muscle_group: exercise.muscle_group || '',
      description: exercise.description || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this exercise?')) {
      return;
    }

    setLoading(true);
    try {
      await deleteExercise(id);
      showMessage('Exercise deleted successfully!', 'success');
      await loadExercises();
    } catch (error) {
      showMessage('Error deleting exercise', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({
      name: '',
      category: 'strength',
      muscle_group: '',
      description: ''
    });
  };

  return (
    <div className="exercise-manager">
      <h1>Exercise Manager</h1>
      <p className="subtitle">Manage your exercise library - Create, Update, and Delete exercises</p>

      {/* Message Display */}
      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      {/* CREATE/UPDATE FORM */}
      <div className="form-section">
        <h2>{editingId ? 'Update Exercise' : 'Create New Exercise'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Exercise Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Bench Press"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Category *</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
              >
                <option value="strength">Strength</option>
                <option value="cardio">Cardio</option>
                <option value="flexibility">Flexibility</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="muscle_group">Muscle Group</label>
              <input
                type="text"
                id="muscle_group"
                name="muscle_group"
                value={formData.muscle_group}
                onChange={handleInputChange}
                placeholder="e.g., chest, legs, back"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Brief description of the exercise"
              rows="3"
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {editingId ? 'Update Exercise' : 'Create Exercise'}
            </button>
            {editingId && (
              <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* EXERCISE LIST */}
      <div className="list-section">
        <h2>All Exercises ({exercises.length})</h2>
        {loading && <p>Loading...</p>}
        
        {!loading && exercises.length === 0 && (
          <p className="empty-message">No exercises found. Create one above!</p>
        )}

        {!loading && exercises.length > 0 && (
          <div className="exercise-table-container">
            <table className="exercise-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Muscle Group</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {exercises.map(exercise => (
                  <tr key={exercise.exercise_id}>
                    <td className="exercise-name">{exercise.name}</td>
                    <td>
                      <span className={`badge badge-${exercise.category}`}>
                        {exercise.category}
                      </span>
                    </td>
                    <td>{exercise.muscle_group || '-'}</td>
                    <td className="description">{exercise.description || '-'}</td>
                    <td className="actions">
                      <button
                        className="btn-small btn-edit"
                        onClick={() => handleEdit(exercise)}
                        disabled={loading}
                      >
                        Edit
                      </button>
                      <button
                        className="btn-small btn-delete"
                        onClick={() => handleDelete(exercise.exercise_id)}
                        disabled={loading}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExerciseManager;

