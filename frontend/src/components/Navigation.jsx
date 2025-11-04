import React from 'react';
import './Navigation.css';

const Navigation = ({ currentPage, onNavigate }) => {
  const navItems = [
    { id: 'exercise-manager', label: 'Exercise Manager', icon: '💪' },
    { id: 'workout-logger', label: 'Workout Logger', icon: '📝' },
    { id: 'workout-report', label: 'Workout Report', icon: '📊' }
  ];

  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-brand">
          <h2>🏋️ Workout Tracker</h2>
          <p>CS 348 Project - Stage 2</p>
        </div>
        
        <ul className="nav-menu">
          {navItems.map(item => (
            <li key={item.id}>
              <button
                className={`nav-link ${currentPage === item.id ? 'active' : ''}`}
                onClick={() => onNavigate(item.id)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;

