# Backend Integration Guide

This guide explains how to connect the React frontend to the Flask backend.

## Current Status

✅ **Frontend**: Complete and working with dummy data  
✅ **Backend**: Complete with SQLite database  
🔄 **Integration**: Ready to connect (see steps below)

## Quick Start - Full Stack

### Terminal 1: Start Backend

```bash
cd backend

# First time setup only:
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python init_db.py
python seed_data.py

# Start the Flask server:
python app.py
```

Backend will run on: `http://localhost:5001`

### Terminal 2: Start Frontend

```bash
cd frontend
npm install  # First time only
npm start
```

Frontend will run on: `http://localhost:3000`

## Switching from Dummy Data to Backend

The frontend currently uses dummy data (in-memory). To connect to the real backend:

### Option 1: Replace the API file (Permanent)

```bash
cd frontend/src/services
mv api.js api-dummy.js         # Backup the dummy version
mv api-backend.js api.js       # Use the backend version
```

### Option 2: Modify imports in components (Selective)

In any component file (e.g., `ExerciseManager.jsx`):

```javascript
// Change from:
import { getAllExercises, ... } from '../services/api';

// To:
import { getAllExercises, ... } from '../services/api-backend';
```

### Option 3: Create a config file (Recommended for production)

Create `frontend/src/config.js`:
```javascript
export const USE_BACKEND = true; // Set to false for dummy data
export const API_BASE_URL = 'http://localhost:5001/api';
```

Then update `api.js` to check the config.

## Verification Steps

### 1. Test Backend Directly

```bash
# Health check
curl http://localhost:5001/api/health

# Get exercises
curl http://localhost:5001/api/exercises

# Get categories (for dynamic dropdown)
curl http://localhost:5001/api/categories
```

### 2. Test Frontend Integration

1. Start both servers (backend + frontend)
2. Open browser console (F12)
3. Navigate to Exercise Manager
4. Check network tab for API calls to `localhost:5000`

### 3. Test CRUD Operations

**Create (INSERT):**
- Go to Exercise Manager
- Fill out the form
- Click "Create Exercise"
- Check if it appears in the table

**Update:**
- Click "Edit" on any exercise
- Modify the data
- Click "Update Exercise"
- Verify changes persist after refresh

**Delete:**
- Click "Delete" on an exercise
- Confirm deletion
- Verify it's removed after refresh

### 4. Test Dynamic Dropdowns

**Workout Logger:**
- Navigate to Workout Logger
- Check that exercise dropdown is populated
- Open browser console
- Look for: `GET http://localhost:5001/api/exercises`

**Workout Report:**
- Navigate to Workout Report
- Check that category filter is populated
- Look for: `GET http://localhost:5001/api/categories`

### 5. Test Filtering & Reports

1. Go to Workout Report
2. Apply filters (date range, category, weight)
3. Click "Apply Filters"
4. Verify the URL in console includes query parameters
5. Check statistics update correctly

## Troubleshooting

### Frontend can't connect to backend

**Error**: `Failed to fetch` or `Network error`

**Solutions**:
1. Verify Flask server is running: `http://localhost:5001`
2. Check CORS configuration in `backend/app.py`
3. Verify frontend URL in CORS origins

### CORS Policy Error

**Error**: `Access-Control-Allow-Origin`

**Solution**: Update `backend/app.py`:
```python
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:3000"],  # Add your frontend URL
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})
```

### Database Locked

**Error**: `database is locked`

**Solutions**:
1. Close any SQLite browser/viewer
2. Restart Flask server
3. Check for multiple Flask instances

### Port 5001 Already in Use

**Error**: `Address already in use`

**Solutions**:
```bash
# Find process using port 5001
lsof -i :5001

# Kill it
kill -9 <PID>

# Or use a different port in app.py:
app.run(debug=True, port=5002)
```

### Changes not persisting

**Possible causes**:
- Still using dummy data (check imports)
- Database file not writable
- Browser cache (try hard refresh: Cmd+Shift+R)

## Demo Preparation

### For the Demo, You Can:

**Option A: Use Backend (Recommended)**
- Shows real database operations
- Changes persist
- More impressive for demo
- **Setup**: Both servers running

**Option B: Use Dummy Data**
- Simpler setup (no backend needed)
- Faster for quick demos
- Still demonstrates all UI features
- **Setup**: Frontend only

**Option C: Hybrid Approach**
- Start with dummy data for UI walkthrough
- Switch to backend for database demo
- Shows both implementations

## Testing Checklist for Demo

- [ ] Backend server starts successfully
- [ ] Frontend connects to backend
- [ ] Exercise CRUD operations work
- [ ] Workout logger saves to database
- [ ] Exercise dropdown loads from database
- [ ] Category filter loads from database
- [ ] Report filters work correctly
- [ ] Statistics update after data changes
- [ ] No console errors
- [ ] Changes persist after page refresh

## API Endpoint Reference

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/exercises` | GET | Get all exercises (dropdown) |
| `/api/exercises` | POST | Create exercise |
| `/api/exercises/<id>` | PUT | Update exercise |
| `/api/exercises/<id>` | DELETE | Delete exercise |
| `/api/workouts` | POST | Create workout |
| `/api/workout-exercises` | POST | Log exercise in workout |
| `/api/reports/summary` | GET | Get filtered report |
| `/api/categories` | GET | Get categories (dropdown) |
| `/api/health` | GET | Health check |

## Data Flow Example

### Creating a New Workout:

1. **User**: Fills out workout form in `WorkoutLogger.jsx`
2. **Frontend**: Calls `createWorkout(data)` from `api.js`
3. **API**: Sends POST to `http://localhost:5001/api/workouts`
4. **Backend**: `routes.py` handles the request
5. **Database**: SQLAlchemy inserts into `workouts` table
6. **Response**: New workout data sent back to frontend
7. **Frontend**: Displays confirmation and updates UI

### Dynamic Dropdown Population:

1. **Component Mount**: `WorkoutLogger.jsx` runs `useEffect`
2. **API Call**: `getAllExercises()` is called
3. **Backend**: Returns all exercises from database
4. **Frontend**: Sets state with exercise data
5. **Render**: Dropdown shows all exercises (not hardcoded!)

## Performance Notes

- Backend responses typically 50-100ms
- Database queries are indexed for speed
- CORS adds minimal overhead
- React dev server uses hot reload

## Next Steps

1. ✅ Backend setup complete
2. ✅ Frontend setup complete
3. 🔄 Connect frontend to backend (this guide)
4. ⏳ Test all features end-to-end
5. ⏳ Practice demo presentation
6. ⏳ Prepare code snippets to show

## Files Changed for Integration

**Backend (Complete - No changes needed)**:
- `backend/app.py` - Flask app with CORS
- `backend/models.py` - Database models
- `backend/routes.py` - API endpoints
- `backend/workout_tracker.db` - SQLite database

**Frontend (One change needed)**:
- `frontend/src/services/api.js` - Replace with `api-backend.js` content
- OR update imports in components to use `api-backend.js`

That's it! The integration is designed to be plug-and-play.

