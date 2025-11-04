# Quick Start Guide

Get your Workout Tracker running in 5 minutes!

## Prerequisites

- Python 3.8+ installed
- Node.js 14+ and npm installed
- Two terminal windows

## Setup Steps

### Step 1: Backend Setup (Terminal 1)

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate  # Mac/Linux
# OR
venv\Scripts\activate     # Windows

# Install dependencies
pip install -r requirements.txt

# Initialize database
python init_db.py

# Seed with sample data
python seed_data.py

# Start Flask server
python app.py
```

✅ Backend should be running on `http://localhost:5001`

### Step 2: Frontend Setup (Terminal 2)

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install

# Start React development server
npm start
```

✅ Frontend should open automatically at `http://localhost:3000`

## What You Should See

### Backend (Terminal 1)
```
Database tables created successfully!
Starting Flask server on http://localhost:5001
API endpoints available at http://localhost:5001/api/
 * Running on http://0.0.0.0:5001
```

### Frontend (Terminal 2)
```
webpack compiled successfully
```

Browser should open with the Workout Tracker app.

## Testing the Application

### 1. Test with Dummy Data (Current Default)

The frontend is currently configured to use in-memory dummy data. You can:
- Navigate between pages
- Create, edit, delete exercises
- Log workouts
- View reports

**Note**: Changes won't persist after page refresh (dummy data).

### 2. Connect to Backend (For Persistent Data)

To use the real database:

**Option A: Replace API file**
```bash
cd frontend/src/services
mv api.js api-dummy.js
cp api-backend.js api.js
```

**Option B: Update imports**
In component files, change:
```javascript
import { ... } from '../services/api';
// to
import { ... } from '../services/api-backend';
```

Then restart the React dev server (Ctrl+C, then `npm start`).

## Verify Backend Connection

1. Open browser console (F12)
2. Go to Network tab
3. Navigate between pages in the app
4. Look for requests to `localhost:5001/api/...`

If you see those requests, you're connected!

## Quick Feature Tour

### 1. Exercise Manager (CRUD Demo)
- View all exercises in table
- Click "Create Exercise" → fill form → submit
- Click "Edit" → modify → submit
- Click "Delete" → confirm

### 2. Workout Logger (Dynamic Dropdown Demo)
- Notice the exercise dropdown is populated
- Select date and exercises
- Add multiple exercises
- Click "Save Workout"

### 3. Workout Report (Filtering Demo)
- Apply filters (date, category, weight)
- Click "Apply Filters"
- Note the statistics
- Go back to Workout Logger, add data
- Return to Report, click "Refresh"
- See updated statistics

## Troubleshooting

### Backend won't start

**Problem**: Port 5001 already in use  
**Solution**:
```bash
lsof -i :5001
kill -9 <PID>
```

**Problem**: Module not found  
**Solution**: Make sure venv is activated
```bash
source venv/bin/activate  # Mac/Linux
```

### Frontend won't start

**Problem**: Port 3000 already in use  
**Solution**: Kill the process or use different port (app will prompt)

**Problem**: Module not found  
**Solution**: Run `npm install` again

### Can't connect frontend to backend

**Problem**: CORS error in browser console  
**Solution**: 
1. Verify backend is running on port 5001
2. Check `backend/app.py` CORS configuration
3. Restart both servers

### Database errors

**Problem**: Database locked  
**Solution**:
1. Close any SQLite browser/viewer
2. Restart Flask server

**Problem**: Tables don't exist  
**Solution**: Run `python init_db.py` again

## API Endpoints (for Testing)

Test the backend directly:

```bash
# Health check
curl http://localhost:5001/api/health

# Get all exercises
curl http://localhost:5001/api/exercises

# Get categories (dynamic dropdown data)
curl http://localhost:5001/api/categories

# Get report
curl "http://localhost:5001/api/reports/summary?category=strength"
```

## File Locations

- **Database**: `backend/workout_tracker.db`
- **Backend API**: `backend/routes.py`
- **Frontend API**: `frontend/src/services/api.js`
- **Components**: `frontend/src/components/`

## Demo Preparation

For your CS 348 demo:

1. **Start both servers** (backend + frontend)
2. **Connect frontend to backend** (for persistence)
3. **Open in browser**: `http://localhost:3000`
4. **Have console open** (F12) to show API calls
5. **Prepare to show**:
   - CRUD operations (Exercise Manager)
   - Dynamic dropdowns (Workout Logger)
   - Filtering & reports (Workout Report)
   - Code snippets (shown in UI)

## Need Help?

- See [README.md](README.md) for project overview
- See [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md) for detailed integration
- See `backend/README.md` for API documentation
- See `frontend/README.md` for frontend details

## Reset Everything

If you want to start fresh:

```bash
# Backend
cd backend
rm workout_tracker.db
python init_db.py
python seed_data.py

# Frontend (if using backend)
# Just refresh the browser
```

---

**You're all set!** 🎉

Both frontend and backend are fully functional. Choose whether to use dummy data (no backend needed) or the full stack (with persistence).

