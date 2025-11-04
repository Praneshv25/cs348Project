# Workout Tracker - Frontend

This is the React frontend for the CS 348 Project Stage 2 - Workout Tracker application.

## Features

- ✅ **Exercise Manager**: Full CRUD operations (Create, Read, Update, Delete) for exercises
- ✅ **Workout Logger**: Log workouts with dynamic exercise selection from database
- ✅ **Workout Report**: Filter and view workout statistics with before/after comparisons

## Setup Instructions

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Run the Development Server

```bash
npm start
```

The application will open at [http://localhost:3000](http://localhost:3000)

## Current Status

🔴 **Using Dummy Data**: The frontend is currently configured to use in-memory dummy data. This allows you to test all features without a backend.

🟢 **Ready for Backend Integration**: The API service layer (`src/services/api.js`) is structured to easily switch from dummy data to real API calls.

## Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── ExerciseManager.jsx      # CRUD for exercises
│   │   ├── WorkoutLogger.jsx        # Log new workouts
│   │   ├── WorkoutReport.jsx        # Reports with filtering
│   │   └── Navigation.jsx           # Navigation bar
│   ├── data/
│   │   └── dummyData.js             # Mock database data
│   ├── services/
│   │   └── api.js                   # API service layer
│   ├── App.jsx                      # Main app component
│   └── index.js                     # Entry point
└── package.json
```

## Demo Requirements Coverage

### Requirement 2a: Insert, Update, Delete
✅ **Location**: Exercise Manager page
- **INSERT**: Use the form to create new exercises
- **UPDATE**: Click "Edit" on any exercise, modify, and save
- **DELETE**: Click "Delete" on any exercise

### Requirement 2b: Filtering & Reports
✅ **Location**: Workout Report page
- Apply filters (date range, category, weight range)
- View statistics before making changes
- Add/modify data in Exercise Manager or Workout Logger
- Return to Report and click "Refresh Report" to see updated statistics

### Requirement 2c: Dynamic UI Components
✅ **Locations**: 
- **Workout Logger**: Exercise dropdown populated from database
- **Workout Report**: Category filter populated from database

**Code Example** (shown in UI):
```javascript
// Exercises are loaded dynamically, not hardcoded!
useEffect(() => {
  const loadExercises = async () => {
    const data = await getAllExercises();
    setExercises(data);
  };
  loadExercises();
}, []);
```

## Available Scripts

- `npm start` - Run development server
- `npm build` - Build for production
- `npm test` - Run tests

## Technologies Used

- React 18
- React Router (for navigation)
- Modern CSS (Flexbox, Grid)
- Dummy data simulation (temporary, backend integration ready)

## Next Steps

1. Set up Flask backend with SQLite database
2. Update `src/services/api.js` to use real API endpoints
3. Configure CORS on Flask backend
4. Test full-stack integration

## Notes for Demo

- All dropdown lists are built dynamically from data (not hardcoded)
- Demo notes are included on each page to guide the presentation
- Statistics update in real-time when data changes
- The UI is responsive and modern

