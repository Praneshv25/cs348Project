# CS 348 Project - Stage 2: Workout Tracker

A full-stack workout tracking application built with React, Flask, and SQLite.

## Project Overview

This application allows users to:
- Manage exercises (CRUD operations)
- Log workouts with multiple exercises
- View filtered reports and statistics
- Demonstrate dynamic UI component population from database

## Technology Stack

- **Frontend**: React 18 with React Router
- **Backend**: Flask 3.0 with SQLAlchemy ORM
- **Database**: SQLite 3
- **API**: RESTful with JSON
- **CORS**: Flask-CORS for cross-origin requests

## Current Status

✅ **Frontend Complete**: Fully functional with dummy data
- All components built and styled
- Dynamic dropdowns and filtering
- CRUD operations working
- Reports with statistics

✅ **Backend Complete**: Flask REST API with SQLAlchemy
- All API endpoints implemented
- CORS configured for React
- Error handling and validation
- Health check endpoint

✅ **Database Complete**: SQLite with sample data
- Schema implemented
- Foreign keys and cascading deletes
- Sample data seeded (15 exercises, 10 workouts, 27 logs)

## Quick Start

### Frontend Only (Dummy Data)

```bash
cd frontend
npm install
npm start
```

Visit [http://localhost:3000](http://localhost:3000)

### Full Stack (Backend + Frontend)

**Terminal 1 - Backend:**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python init_db.py
python seed_data.py
python app.py
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
npm start
```

**Connect Frontend to Backend:**
See [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md) for detailed instructions.

## Project Structure

```
project_part2/
├── frontend/              # React application (COMPLETE)
│   ├── src/
│   │   ├── components/   # UI components
│   │   ├── data/         # Dummy data
│   │   ├── services/     # API layer
│   │   └── App.jsx       # Main app
│   └── package.json
│
├── backend/              # Flask backend (TODO)
│   ├── app.py           # Flask application
│   ├── models.py        # Database models
│   └── routes.py        # API endpoints
│
└── README.md
```

## Stage 2 Rubric Coverage

### 1. Database Design ✅

**Tables Designed**:
- `exercises` - Exercise library (name, category, muscle_group)
- `users` - User accounts
- `workouts` - Workout sessions (date, duration, notes)
- `workout_exercises` - Exercise logs (sets, reps, weight)

**Relationships**:
- `users` → `workouts` (1:many)
- `workouts` → `workout_exercises` (1:many)
- `exercises` → `workout_exercises` (1:many)

### 2. Demo Requirements

#### 2a. Insert, Update, Delete ✅
**Location**: Exercise Manager page
- Create new exercises (INSERT)
- Edit existing exercises (UPDATE)
- Delete exercises (DELETE)

#### 2b. Filtering & Reports ✅
**Location**: Workout Report page
- Filter by: date range, exercise category, weight range
- Display statistics: total workouts, sets, reps, average weight
- **Before/After Demo**: 
  1. View initial report
  2. Add/modify data
  3. Refresh report to see changes

#### 2c. Dynamic UI Components ✅
**Locations**:
- Workout Logger: Exercise dropdown
- Workout Report: Category filter

All dropdowns are populated dynamically from data source (not hardcoded).

**Code demonstration available in UI with comments.**

## Features

### Exercise Manager
- View all exercises in a table
- Create new exercises with form validation
- Edit existing exercises (inline editing)
- Delete exercises with confirmation
- Category badges (strength, cardio, flexibility)

### Workout Logger
- Select date and duration
- **Dynamic exercise dropdown** (key requirement!)
- Add multiple exercises to one workout
- Track sets, reps, weight, distance, duration
- View last saved workout

### Workout Report
- **Dynamic category filter** (key requirement!)
- Date range filtering
- Weight range filtering
- Summary statistics (cards with gradients)
- Exercise breakdown table
- Detailed workout list
- Refresh button for before/after comparison

## Database Schema (Designed)

```sql
-- Users
CREATE TABLE users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Exercises (managed in Exercise Manager)
CREATE TABLE exercises (
    exercise_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL,
    muscle_group TEXT,
    description TEXT
);

-- Workouts
CREATE TABLE workouts (
    workout_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    workout_date DATE NOT NULL,
    duration_minutes INTEGER,
    notes TEXT,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Exercise logs (exercises performed in each workout)
CREATE TABLE workout_exercises (
    log_id INTEGER PRIMARY KEY AUTOINCREMENT,
    workout_id INTEGER NOT NULL,
    exercise_id INTEGER NOT NULL,
    sets INTEGER,
    reps INTEGER,
    weight_lbs REAL,
    distance_miles REAL,
    duration_seconds INTEGER,
    FOREIGN KEY (workout_id) REFERENCES workouts(workout_id) ON DELETE CASCADE,
    FOREIGN KEY (exercise_id) REFERENCES exercises(exercise_id)
);
```

## Demo Script

### Part 1: Exercise Manager (CRUD - 2 min)
1. Show the exercise table with existing data
2. **CREATE**: Fill form, add new exercise
3. **UPDATE**: Click edit, modify, save
4. **DELETE**: Delete an exercise
5. Show updated table

### Part 2: Dynamic Dropdowns (2 min)
1. Navigate to Workout Logger
2. Show exercise dropdown
3. **Point out**: "This dropdown is loaded from the database, not hardcoded"
4. Show code snippet in the UI
5. Navigate to Workout Report
6. Show category filter (also dynamic)

### Part 3: Filtering & Reports (3 min)
1. Show Workout Report with initial statistics
2. Apply filters (date range, category, weight)
3. Show filtered results
4. **Before/After Demo**:
   - Note current statistics
   - Go to Workout Logger
   - Add a new workout
   - Return to Report
   - Click "Refresh Report"
   - Show updated statistics

## Next Steps

1. ✅ **Backend Implementation**: Complete
2. ✅ **Database Setup**: Complete
3. 🔄 **Integration**: Ready (see INTEGRATION_GUIDE.md)
4. ⏳ **Testing**: Test full-stack functionality
5. ⏳ **Demo Preparation**: Practice presentation

## Development Timeline

- ✅ Phase 1: Database design (Complete)
- ✅ Phase 2: Frontend implementation (Complete)
- ✅ Phase 3: Backend implementation (Complete)
- 🔄 Phase 4: Integration & testing (Ready)
- ⏳ Phase 5: Demo preparation (Next)

## Notes

- The frontend is fully functional with dummy data
- All rubric requirements are addressed in the frontend
- Backend integration will be straightforward due to clean API layer
- Demo notes are embedded in each page for easy reference

## License

Academic project for CS 348 - University Course

# cs348Project
