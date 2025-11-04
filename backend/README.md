# Workout Tracker - Backend API

Flask REST API with SQLite database for the CS 348 Project Stage 2.

## Features

- RESTful API endpoints
- SQLite database with SQLAlchemy ORM
- CORS enabled for React frontend
- Full CRUD operations
- Advanced filtering and reporting

## Setup Instructions

### 1. Create Virtual Environment (Recommended)

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Initialize Database

```bash
python init_db.py
```

This will create the SQLite database with all required tables.

### 4. Seed Database with Sample Data

```bash
python seed_data.py
```

This will populate the database with:
- 3 users
- 15 exercises
- 10 workouts
- 27 exercise logs

### 5. Run the Server

```bash
python app.py
```

The API will be available at: `http://localhost:5001`

## API Endpoints

### Exercise Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/exercises` | Get all exercises (for dropdowns) |
| GET | `/api/exercises/<id>` | Get specific exercise |
| POST | `/api/exercises` | Create new exercise |
| PUT | `/api/exercises/<id>` | Update exercise |
| DELETE | `/api/exercises/<id>` | Delete exercise |

### Workout Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/workouts` | Get all workouts |
| GET | `/api/workouts/<id>` | Get specific workout with exercises |
| POST | `/api/workouts` | Create new workout |
| PUT | `/api/workouts/<id>` | Update workout |
| DELETE | `/api/workouts/<id>` | Delete workout |

### Workout Exercise Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/workout-exercises` | Log exercise in workout |
| DELETE | `/api/workout-exercises/<id>` | Delete exercise log |

### Report Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reports/summary` | Get filtered workout report |
| GET | `/api/categories` | Get exercise categories (dynamic) |
| GET | `/api/muscle-groups` | Get muscle groups (dynamic) |

### Filtering Parameters

For `/api/reports/summary`, use query parameters:
- `startDate` - Filter by start date (YYYY-MM-DD)
- `endDate` - Filter by end date (YYYY-MM-DD)
- `category` - Filter by exercise category
- `minWeight` - Minimum weight filter
- `maxWeight` - Maximum weight filter

**Example:**
```
GET http://localhost:5001/api/reports/summary?startDate=2025-10-01&category=strength&minWeight=100
```

## Database Schema

### users
- `user_id` (PK, AUTO INCREMENT)
- `username` (UNIQUE, NOT NULL)
- `email` (UNIQUE, NOT NULL)
- `created_at` (TIMESTAMP)

### exercises
- `exercise_id` (PK, AUTO INCREMENT)
- `name` (UNIQUE, NOT NULL)
- `category` (NOT NULL)
- `muscle_group`
- `description`

### workouts
- `workout_id` (PK, AUTO INCREMENT)
- `user_id` (FK → users.user_id, CASCADE DELETE)
- `workout_date` (NOT NULL)
- `duration_minutes`
- `notes`

### workout_exercises
- `log_id` (PK, AUTO INCREMENT)
- `workout_id` (FK → workouts.workout_id, CASCADE DELETE)
- `exercise_id` (FK → exercises.exercise_id)
- `sets`
- `reps`
- `weight_lbs`
- `distance_miles`
- `duration_seconds`

## Example API Requests

### Create Exercise (POST)
```bash
curl -X POST http://localhost:5001/api/exercises \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Push-ups",
    "category": "strength",
    "muscle_group": "chest",
    "description": "Bodyweight chest exercise"
  }'
```

### Get All Exercises (GET)
```bash
curl http://localhost:5001/api/exercises
```

### Create Workout (POST)
```bash
curl -X POST http://localhost:5001/api/workouts \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 1,
    "workout_date": "2025-11-04",
    "duration_minutes": 60,
    "notes": "Morning workout"
  }'
```

### Get Report with Filters (GET)
```bash
curl "http://localhost:5001/api/reports/summary?category=strength&minWeight=100"
```

## Testing

You can test the API using:
- **curl** (command line)
- **Postman** (GUI)
- **Browser** (for GET requests)
- **React Frontend** (integrated testing)

## CORS Configuration

The API is configured to accept requests from:
- `http://localhost:3000` (React dev server)

To add more origins, edit `app.py`:
```python
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:3000", "http://localhost:3001"],
        ...
    }
})
```

## Development Notes

- Database file: `workout_tracker.db` (created automatically)
- Debug mode: Enabled (disable in production)
- Port: 5001 (configurable in `app.py`)

## Troubleshooting

### Port Already in Use
```bash
# Find process using port 5001
lsof -i :5001
# Kill process
kill -9 <PID>
```

### Database Locked
- Close any SQLite viewers
- Restart the Flask server

### CORS Errors
- Ensure Flask server is running on port 5001
- Check that frontend is on `http://localhost:3000`
- Verify CORS configuration in `app.py`

## Project Structure

```
backend/
├── app.py              # Main Flask application
├── models.py           # SQLAlchemy database models
├── routes.py           # API route handlers
├── config.py           # Configuration settings
├── init_db.py          # Database initialization script
├── seed_data.py        # Sample data seeding script
├── requirements.txt    # Python dependencies
└── workout_tracker.db  # SQLite database (created after init)
```

## Next Steps

1. ✅ Backend complete
2. Update frontend to use real API endpoints
3. Test full-stack integration
4. Prepare demo

## Notes

- All endpoints return JSON
- Error responses include `{"error": "message"}`
- Success responses include appropriate data
- Database operations use transactions (rollback on error)

