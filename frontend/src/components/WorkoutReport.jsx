import React, { useState, useEffect } from 'react';
import { getWorkoutReport, getExerciseCategories } from '../services/api';
import './WorkoutReport.css';

const WorkoutReport = () => {
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    category: 'all',
    minWeight: '',
    maxWeight: ''
  });
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Load categories dynamically on mount
  useEffect(() => {
    loadCategories();
    // Load initial report with default filters
    loadReport({});
  }, []);

  const loadCategories = async () => {
    try {
      const data = await getExerciseCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadReport = async (customFilters = null) => {
    setLoading(true);
    try {
      const filtersToUse = customFilters || filters;
      const data = await getWorkoutReport(filtersToUse);
      setReportData(data);
      setLastUpdated(new Date().toLocaleString());
    } catch (error) {
      console.error('Error loading report:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleApplyFilters = () => {
    loadReport();
  };

  const handleResetFilters = () => {
    const defaultFilters = {
      startDate: '',
      endDate: '',
      category: 'all',
      minWeight: '',
      maxWeight: ''
    };
    setFilters(defaultFilters);
    loadReport(defaultFilters);
  };

  const handleRefreshReport = () => {
    loadReport();
  };

  return (
    <div className="workout-report">
      <h1>Workout Report</h1>
      <p className="subtitle">Filter your workouts and view statistics</p>

      {/* FILTER PANEL */}
      <div className="filter-panel">
        <h2>Filters</h2>
        
        <div className="filter-grid">
          <div className="form-group">
            <label htmlFor="startDate">Start Date</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="endDate">End Date</label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">
              Exercise Category
            </label>
            <select
              id="category"
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="minWeight">Min Weight (lbs)</label>
            <input
              type="number"
              id="minWeight"
              name="minWeight"
              value={filters.minWeight}
              onChange={handleFilterChange}
              placeholder="e.g., 100"
              step="5"
            />
          </div>

          <div className="form-group">
            <label htmlFor="maxWeight">Max Weight (lbs)</label>
            <input
              type="number"
              id="maxWeight"
              name="maxWeight"
              value={filters.maxWeight}
              onChange={handleFilterChange}
              placeholder="e.g., 300"
              step="5"
            />
          </div>
        </div>

        <div className="filter-actions">
          <button 
            className="btn btn-primary" 
            onClick={handleApplyFilters}
            disabled={loading}
          >
            Apply Filters
          </button>
          <button 
            className="btn btn-secondary" 
            onClick={handleResetFilters}
            disabled={loading}
          >
            Reset
          </button>
          <button 
            className="btn btn-refresh" 
            onClick={handleRefreshReport}
            disabled={loading}
          >
            🔄 Refresh Report
          </button>
        </div>

        {lastUpdated && (
          <p className="last-updated">Last updated: {lastUpdated}</p>
        )}
      </div>

      {/* REPORT SECTION */}
      {loading && (
        <div className="loading-message">Loading report...</div>
      )}

      {!loading && reportData && (
        <>
          {/* SUMMARY STATISTICS */}
          <div className="report-section">
            <h2>Summary Statistics</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-value">{reportData.summary.totalWorkouts}</div>
                <div className="stat-label">Total Workouts</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{reportData.summary.totalSets}</div>
                <div className="stat-label">Total Sets</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{reportData.summary.totalReps}</div>
                <div className="stat-label">Total Reps</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{reportData.summary.avgWeight}</div>
                <div className="stat-label">Avg Weight (lbs)</div>
              </div>
            </div>
          </div>

          {/* EXERCISE BREAKDOWN */}
          {Object.keys(reportData.summary.exerciseBreakdown).length > 0 && (
            <div className="report-section">
              <h2>Exercise Breakdown</h2>
              <div className="exercise-breakdown">
                <table className="breakdown-table">
                  <thead>
                    <tr>
                      <th>Exercise</th>
                      <th>Times Performed</th>
                      <th>Total Sets</th>
                      <th>Total Reps</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(reportData.summary.exerciseBreakdown)
                      .sort((a, b) => b[1].count - a[1].count)
                      .map(([name, stats]) => (
                        <tr key={name}>
                          <td className="exercise-name">{name}</td>
                          <td>{stats.count}</td>
                          <td>{stats.totalSets}</td>
                          <td>{stats.totalReps}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* DETAILED WORKOUT LIST */}
          {reportData.workouts.length > 0 && (
            <div className="report-section">
              <h2>Workout Details ({reportData.workouts.length})</h2>
              <div className="workout-list">
                {reportData.workouts
                  .sort((a, b) => new Date(b.workout_date) - new Date(a.workout_date))
                  .map(workout => (
                    <div key={workout.workout_id} className="workout-card">
                      <div className="workout-header">
                        <h3>{new Date(workout.workout_date).toLocaleDateString()}</h3>
                        {workout.duration_minutes && (
                          <span className="duration">{workout.duration_minutes} min</span>
                        )}
                      </div>
                      {workout.notes && (
                        <p className="workout-notes">{workout.notes}</p>
                      )}
                      {workout.exercises && workout.exercises.length > 0 && (
                        <div className="workout-exercises">
                          {workout.exercises.map((ex, idx) => (
                            <div key={idx} className="exercise-log">
                              <strong>{ex.exercise_name}</strong>
                              <span className="exercise-details">
                                {ex.sets && ex.reps && ` ${ex.sets}×${ex.reps}`}
                                {ex.weight_lbs && ` @ ${ex.weight_lbs} lbs`}
                                {ex.distance_miles && ` ${ex.distance_miles} miles`}
                                {ex.duration_seconds && ` ${ex.duration_seconds}s`}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}

          {reportData.workouts.length === 0 && (
            <div className="report-section">
              <p className="empty-message">No workouts found matching the selected filters.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default WorkoutReport;

