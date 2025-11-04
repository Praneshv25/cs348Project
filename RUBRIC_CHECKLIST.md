# CS 348 Stage 2 - Rubric Compliance Checklist

## ✅ Complete - All Requirements Met

---

## Deliverable 1: Database Design

### ✅ **Database Tables with Primary Keys**

**Location:** `backend/models.py`

| Table | Primary Key | Description |
|-------|-------------|-------------|
| `users` | `user_id` (INTEGER, AUTO INCREMENT) | User accounts |
| `exercises` | `exercise_id` (INTEGER, AUTO INCREMENT) | Exercise library |
| `workouts` | `workout_id` (INTEGER, AUTO INCREMENT) | Workout sessions |
| `workout_exercises` | `log_id` (INTEGER, AUTO INCREMENT) | Exercise logs within workouts |

**Code Evidence:**
```python
# models.py lines 10, 31, 54, 82
user_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
exercise_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
workout_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
log_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
```

### ✅ **Foreign Keys with Relationships**

| Foreign Key | References | Cascade Behavior |
|-------------|------------|------------------|
| `workouts.user_id` | `users.user_id` | CASCADE DELETE |
| `workout_exercises.workout_id` | `workouts.workout_id` | CASCADE DELETE |
| `workout_exercises.exercise_id` | `exercises.exercise_id` | - |

**Code Evidence:**
```python
# models.py lines 55, 83-84
user_id = db.Column(db.Integer, db.ForeignKey('users.user_id', ondelete='CASCADE'), nullable=False)
workout_id = db.Column(db.Integer, db.ForeignKey('workouts.workout_id', ondelete='CASCADE'), nullable=False)
exercise_id = db.Column(db.Integer, db.ForeignKey('exercises.exercise_id'), nullable=False)
```

### ✅ **Relational Database (SQLite)**

**Implementation:**
- SQLite database: `backend/workout_tracker.db`
- SQLAlchemy ORM for database operations
- Proper relationships between tables
- Sample data provided via `backend/seed_data.py`

**Demo Preparation:**
- Show `models.py` to demonstrate schema
- Show database file exists after `init_db.py` and `seed_data.py`
- Optional: Open with SQLite viewer to show actual tables

---

## Deliverable 2a: Insert, Update, Delete Operations

### ✅ **INSERT - Create New Exercise**

**Backend API:** `POST /api/exercises` (routes.py lines 30-58)
- Creates new exercise in `exercises` table
- Validates required fields (name, category)
- Checks for duplicate names
- Returns created exercise with ID

**Frontend:** Exercise Manager component
- Form to input exercise details
- Validates input
- Calls `createExercise()` API
- Displays success message
- Table automatically updates with new exercise

**Demo Steps:**
1. Navigate to Exercise Manager
2. Fill in form: "Push-ups", category "strength", muscle "chest"
3. Click "Create Exercise"
4. See new exercise appear in table
5. Refresh page - data persists (proves database INSERT)

**SQL Executed (behind the scenes):**
```sql
INSERT INTO exercises (name, category, muscle_group, description) 
VALUES ('Push-ups', 'strength', 'chest', 'Bodyweight exercise');
```

### ✅ **UPDATE - Modify Exercise**

**Backend API:** `PUT /api/exercises/<id>` (routes.py lines 61-90)
- Updates existing exercise by ID
- Validates no duplicate names
- Modifies only provided fields
- Returns updated exercise

**Frontend:** Exercise Manager component
- "Edit" button on each row
- Pre-fills form with current values
- Allows modification
- Saves changes back to database

**Demo Steps:**
1. Click "Edit" on any exercise (e.g., "Bench Press")
2. Modify description: "Compound chest exercise - great for upper body"
3. Click "Update Exercise"
4. See changes reflected in table
5. Refresh page - changes persist (proves database UPDATE)

**SQL Executed (behind the scenes):**
```sql
UPDATE exercises 
SET description = 'Compound chest exercise - great for upper body'
WHERE exercise_id = 1;
```

### ✅ **DELETE - Remove Exercise**

**Backend API:** `DELETE /api/exercises/<id>` (routes.py lines 93-100)
- Deletes exercise by ID
- Returns success confirmation
- Associated workout_exercises remain (no FK cascade on exercises)

**Frontend:** Exercise Manager component
- "Delete" button on each row
- Confirmation dialog (prevents accidental deletion)
- Removes from table after confirmation
- Updates display

**Demo Steps:**
1. Click "Delete" on an exercise (e.g., "Plank")
2. Confirm deletion in dialog
3. See exercise removed from table
4. Refresh page - still deleted (proves database DELETE)

**SQL Executed (behind the scenes):**
```sql
DELETE FROM exercises WHERE exercise_id = 15;
```

---

## Deliverable 2b: Filtering & Reports (Before/After)

### ✅ **Data Filtering with Ranges**

**Backend API:** `GET /api/reports/summary` (routes.py lines 237-314)

**Filtering Capabilities:**
1. **Date Range:** `startDate` and `endDate` parameters
   ```sql
   WHERE workout_date >= '2025-10-01' AND workout_date <= '2025-11-04'
   ```

2. **Category Filter:** `category` parameter
   ```sql
   JOIN exercises ON ... WHERE exercise.category = 'strength'
   ```

3. **Weight Range:** `minWeight` and `maxWeight` parameters
   ```sql
   WHERE weight_lbs >= 100 AND weight_lbs <= 300
   ```

**Code Evidence:**
```python
# routes.py lines 242-271
start_date = request.args.get('startDate')
end_date = request.args.get('endDate')
category = request.args.get('category')
min_weight = request.args.get('minWeight')
max_weight = request.args.get('maxWeight')

# Apply filters to queries
if start_date:
    workout_query = workout_query.filter(Workout.workout_date >= start_date)
if category and category != 'all':
    we_query = we_query.join(Exercise).filter(Exercise.category == category)
if min_weight:
    we_query = we_query.filter(WorkoutExercise.weight_lbs >= float(min_weight))
```

### ✅ **Display Report**

**Frontend:** Workout Report component

**Report Displays:**
1. **Summary Statistics:**
   - Total Workouts
   - Total Sets
   - Total Reps
   - Average Weight

2. **Exercise Breakdown Table:**
   - Exercise name
   - Times performed
   - Total sets
   - Total reps

3. **Detailed Workout List:**
   - Date, duration, notes
   - All exercises in each workout
   - Sets, reps, weight for each exercise

### ✅ **Before/After Demonstration**

**Demo Script:**

**BEFORE:**
1. Navigate to Workout Report
2. Apply filters:
   - Start date: 2025-10-28
   - End date: 2025-11-04
   - Category: strength
   - Min weight: 100 lbs
3. Click "Apply Filters"
4. **Note the statistics:**
   - Total Workouts: X
   - Total Sets: Y
   - Average Weight: Z

**MAKE CHANGES:**
5. Navigate to Workout Logger
6. Create new workout:
   - Date: Today
   - Add exercise: Bench Press, 4 sets × 8 reps @ 200 lbs
   - Save workout

**AFTER:**
7. Return to Workout Report
8. Keep same filters applied
9. Click "🔄 Refresh Report" button
10. **Show updated statistics:**
    - Total Workouts: X + 1
    - Total Sets: Y + 4
    - Average Weight: (new calculation)
11. New workout appears in detailed list

**This demonstrates:**
- ✅ Data is stored in database
- ✅ Filters work correctly
- ✅ Statistics recalculate based on filtered data
- ✅ Changes persist and are reflected in reports

---

## Deliverable 2c: Dynamic UI Components (NOT Hardcoded)

### ✅ **Requirement: Dropdown/List Built from Database**

**Critical Requirement:** UI components must retrieve data from database dynamically, NOT be hardcoded in the interface.

### ✅ **Implementation 1: Exercise Dropdown in Workout Logger**

**Backend API:** `GET /api/exercises` (routes.py lines 10-17)
```python
@api.route('/exercises', methods=['GET'])
def get_exercises():
    """Get all exercises - used for dynamic dropdowns"""
    exercises = Exercise.query.all()
    return jsonify([ex.to_dict() for ex in exercises]), 200
```

**Frontend Component:** `WorkoutLogger.jsx` (lines 31-47, 237-242)

**Code Evidence:**
```javascript
// Lines 31-47: Load exercises from API on component mount
useEffect(() => {
  loadExercises();
}, []);

const loadExercises = async () => {
  setLoading(true);
  try {
    // This demonstrates dynamic data loading for the dropdown
    const data = await getAllExercises();  // API call to database
    setExercises(data);  // Store in state
  } catch (error) {
    showMessage('Error loading exercises', 'error');
  } finally {
    setLoading(false);
  }
};

// Lines 237-242: Render dropdown with fetched data
<select>
  <option value="">-- Select Exercise --</option>
  {/* IMPORTANT: This dropdown is built dynamically from database! */}
  {exercises.map(exercise => (
    <option key={exercise.exercise_id} value={exercise.exercise_id}>
      {exercise.name} ({exercise.category})
    </option>
  ))}
</select>
```

**API Call:**
```
GET http://localhost:5001/api/exercises
Response: [
  {"exercise_id": 1, "name": "Bench Press", "category": "strength", ...},
  {"exercise_id": 2, "name": "Squat", "category": "strength", ...},
  ...
]
```

### ✅ **Implementation 2: Category Filter in Workout Report**

**Backend API:** `GET /api/categories` (routes.py lines 317-324)
```python
@api.route('/categories', methods=['GET'])
def get_categories():
    """Get unique exercise categories - for dynamic dropdowns"""
    categories = db.session.query(Exercise.category).distinct().all()
    return jsonify([cat[0] for cat in categories]), 200
```

**SQL Executed:**
```sql
SELECT DISTINCT category FROM exercises;
```

**Frontend Component:** `WorkoutReport.jsx` (lines 19-24, 52-60)

**Code Evidence:**
```javascript
// Lines 19-24: Load categories from database
useEffect(() => {
  loadCategories();
  loadReport({});
}, []);

const loadCategories = async () => {
  try {
    const data = await getExerciseCategories();  // API call to database
    setCategories(data);  // NOT hardcoded!
  } catch (error) {
    console.error('Error loading categories:', error);
  }
};

// Lines 52-60: Render category filter with fetched data
<select id="category" name="category" value={filters.category} onChange={handleFilterChange}>
  <option value="all">All Categories</option>
  {/* IMPORTANT: Categories loaded dynamically from database! */}
  {categories.map(cat => (
    <option key={cat} value={cat}>
      {cat.charAt(0).toUpperCase() + cat.slice(1)}
    </option>
  ))}
</select>
```

**API Call:**
```
GET http://localhost:5001/api/categories
Response: ["strength", "cardio", "flexibility"]
```

### ✅ **Proof It's NOT Hardcoded:**

**Test in Demo:**
1. Show current exercise dropdown has 15 exercises
2. Go to Exercise Manager
3. Add new exercise: "Yoga" (category: flexibility)
4. Return to Workout Logger
5. Refresh page or reload dropdown
6. **NEW EXERCISE APPEARS** in dropdown (proves dynamic loading)

**Alternative Test:**
1. Show category filter has 3 options
2. Delete all "flexibility" exercises from database
3. Refresh Workout Report
4. **Category dropdown automatically updates** (proves dynamic loading)

### ✅ **Demo Presentation - Show Code/Query**

**In Demo, Show:**

1. **Browser Network Tab:**
   - Open Developer Tools (F12)
   - Go to Network tab
   - Navigate to Workout Logger
   - **Point out:** `GET http://localhost:5001/api/exercises` request
   - Show response data in JSON format

2. **Frontend Code:**
   - Open `WorkoutLogger.jsx` in editor
   - **Show lines 31-47:** `useEffect` and `loadExercises()`
   - **Highlight:** `const data = await getAllExercises();`
   - **Show lines 237-242:** `.map()` function building dropdown
   - **Point out comment:** "NOT hardcoded!"

3. **Backend Code:**
   - Open `routes.py` in editor
   - **Show lines 10-17:** `get_exercises()` endpoint
   - **Highlight:** `Exercise.query.all()` - database query
   - **Show lines 317-324:** `get_categories()` endpoint
   - **Highlight:** `.distinct()` SQL query

4. **Code Snippet in UI:**
   - Workout Logger page has "Demo Notes" section
   - Shows actual code snippet with syntax highlighting
   - Can point to this during demo

---

## Summary of Compliance

| Requirement | Status | Evidence Location |
|-------------|--------|-------------------|
| **Database Design** | ✅ Complete | `backend/models.py`, 4 tables with PKs and FKs |
| **INSERT Operation** | ✅ Complete | `routes.py` lines 30-58, Exercise Manager UI |
| **UPDATE Operation** | ✅ Complete | `routes.py` lines 61-90, Exercise Manager UI |
| **DELETE Operation** | ✅ Complete | `routes.py` lines 93-100, Exercise Manager UI |
| **Filtering - Date Range** | ✅ Complete | `routes.py` lines 252-255, Workout Report filters |
| **Filtering - Category** | ✅ Complete | `routes.py` lines 264-265, Workout Report filters |
| **Filtering - Weight Range** | ✅ Complete | `routes.py` lines 268-271, Workout Report filters |
| **Display Report** | ✅ Complete | Workout Report component with statistics |
| **Before/After Demo** | ✅ Complete | Refresh button updates report after changes |
| **Dynamic Dropdown 1** | ✅ Complete | Exercise dropdown in Workout Logger (lines 31-47, 237-242) |
| **Dynamic Dropdown 2** | ✅ Complete | Category filter in Workout Report (lines 19-24, 52-60) |
| **Show Code/Query** | ✅ Complete | Code snippets in UI, can show in editor + network tab |

---

## Files to Reference During Demo

### Show Database Schema:
- `backend/models.py` (lines 1-104)

### Show CRUD APIs:
- `backend/routes.py` (lines 30-100)

### Show Filtering API:
- `backend/routes.py` (lines 237-314)

### Show Dynamic Loading APIs:
- `backend/routes.py` (lines 10-17, 317-324)

### Show Dynamic UI Implementation:
- `frontend/src/components/WorkoutLogger.jsx` (lines 31-47, 237-242)
- `frontend/src/components/WorkoutReport.jsx` (lines 19-24, 52-60)

### Show API Service:
- `frontend/src/services/api.js` (shows fetch calls to backend)

---

## Demo Flow (5-15 minutes)

### Part 1: Database Design (2 min)
1. Open `backend/models.py`
2. Show 4 tables with primary keys
3. Point out foreign key relationships
4. Show CASCADE DELETE configurations

### Part 2: CRUD Operations (3 min)
1. Navigate to Exercise Manager
2. **INSERT:** Create new exercise, show in table
3. **UPDATE:** Edit exercise, show changes
4. **DELETE:** Delete exercise, confirm removal
5. Refresh browser - changes persist

### Part 3: Filtering & Before/After (4 min)
1. Navigate to Workout Report
2. Show initial statistics (BEFORE)
3. Apply filters (date, category, weight)
4. Show filtered results
5. Navigate to Workout Logger
6. Add new workout with exercises
7. Return to Report, click Refresh
8. Show updated statistics (AFTER)

### Part 4: Dynamic UI (3 min)
1. Open browser console, Network tab
2. Navigate to Workout Logger
3. **Show:** Exercise dropdown populated
4. **Point out:** API call in Network tab
5. Open `WorkoutLogger.jsx` in editor
6. **Show code:** Lines 31-47 (API call)
7. **Show code:** Lines 237-242 (dropdown rendering)
8. Navigate to Workout Report
9. **Show:** Category filter populated
10. **Point out:** Another API call in Network tab

### Conclusion (1 min)
- All requirements met
- Database properly designed with relationships
- Full CRUD operations working
- Filtering with before/after demonstration
- UI components 100% dynamically loaded from database
- NOT hardcoded!

---

## Technical Stack Summary

- **Database:** SQLite 3
- **Backend:** Flask 3.0 + SQLAlchemy ORM
- **Frontend:** React 18
- **API:** RESTful with JSON
- **Port:** Backend on 5001, Frontend on 3000
- **CORS:** Configured for cross-origin requests

---

## ✅ All Stage 2 Requirements Verified and Complete

Last updated: November 4, 2025

