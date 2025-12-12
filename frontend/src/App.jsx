import React, { useState } from 'react';
import Navigation from './components/Navigation';
import ExerciseManager from './components/ExerciseManager';
import WorkoutLogger from './components/WorkoutLogger';
import WorkoutReport from './components/WorkoutReport';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('exercise-manager');

  const renderPage = () => {
    switch (currentPage) {
      case 'exercise-manager':
        return <ExerciseManager />;
      case 'workout-logger':
        return <WorkoutLogger />;
      case 'workout-report':
        return <WorkoutReport />;
      default:
        return <ExerciseManager />;
    }
  };

  return (
    <div className="App">
      <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
      <main className="main-content">
        {renderPage()}
      </main>
      <footer className="footer">
        <p>CS 348 Project - Stage 2 | Workout Tracker Application</p>
        <p className="tech-stack">React + SQLite + Flask</p>
      </footer>
    </div>
  );
}

export default App;

