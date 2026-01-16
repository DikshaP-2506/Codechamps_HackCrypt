# Database Schema Documentation

## Collections Overview

### 1. **users** Collection
Primary user collection storing authentication and profile information.

```json
{
  "_id": ObjectId,
  "clerkId": String (unique, required),
  "email": String (unique, required),
  "name": String,
  "firstName": String,
  "lastName": String,
  "phone": String,
  "role": String (enum: "patient", "doctor", "nurse", "admin"),
  "dateOfBirth": Date,
  "gender": String (enum: "male", "female", "other"),
  "photoUrl": String,
  "isActive": Boolean,
  "lastLogin": Date,
  "createdAt": Date (auto-generated),
  "updatedAt": Date (auto-generated),
  "__v": Number
}
```

**Indexes:**
- clerkId (unique, indexed)
- email (unique, indexed)
- role

**Example:**
```json
{
  "clerkId": "user_38L1RXexwDvHLfS25LBOnL7vJTy",
  "email": "p22724439@gmail.com",
  "firstName": "Pradnya",
  "role": "patient",
  "isActive": true
}
```

---

### 2. **patients** Collection
Extended patient profile information linked to users via clerk_user_id.

```json
{
  "_id": ObjectId,
  "clerk_user_id": String (indexed, unique),
  "name": String,
  "date_of_birth": Date,
  "gender": String (enum: "Male", "Female", "Other"),
  "blood_group": String,
  "emergency_contact_name": String,
  "emergency_contact_phone": String,
  "address": String,
  "allergies": Array[String],
  "chronic_conditions": Array[String],
  "past_surgeries": Array[String],
  "family_history": String,
  "is_active": Boolean,
  "role": String (enum: "patient"),
  "created_at": Date (auto-generated),
  "updated_at": Date (auto-generated),
  "__v": Number
}
```

**Indexes:**
- clerk_user_id (unique, indexed)
- is_active

**Example:**
```json
{
  "clerk_user_id": "user_2abc123xyz",
  "name": "sakshi thorat",
  "blood_group": "O+",
  "emergency_contact_phone": "9123456789"
}
```

---

### 3. **physical_vitals** Collection
Health metrics recorded for patients.

```json
{
  "_id": ObjectId,
  "patient_id": String (indexed),
  "recorded_by": String (Clerk user ID of healthcare provider),
  "recorded_at": Date,
  "systolic_bp": Number (optional),
  "diastolic_bp": Number,
  "heart_rate": Number,
  "blood_sugar": Number,
  "respiratory_rate": Number,
  "temperature": Number,
  "spo2": Number (SpO2 percentage),
  "weight": Number (kg),
  "height": Number (cm),
  "bmi": Number (calculated),
  "measurement_method": String (enum: "manual_entry", "device_sync"),
  "notes": String,
  "created_at": Date (auto-generated),
  "updated_at": Date (auto-generated),
  "__v": Number
}
```

**Indexes:**
- patient_id (indexed)
- recorded_at (indexed for time-series queries)
- recorded_by

**Example:**
```json
{
  "patient_id": "123456",
  "recorded_by": "user_38L5bPBeSC4d7hWG5y6EadYSDKu",
  "heart_rate": 72,
  "blood_sugar": 100,
  "weight": 70,
  "height": 168,
  "bmi": 24.8
}
```

---

### 4. **whack_a_mole_games** Collection (Games Backend)
Whack-a-Mole game session records.

```json
{
  "_id": ObjectId,
  "clerk_user_id": String (indexed, required),
  "patient_id": ObjectId (optional, references patients._id),
  "final_score": Number,
  "total_clicks": Number,
  "total_misses": Number,
  "accuracy": Number (0-100 percentage),
  "time_taken": Number (seconds),
  "peak_speed": Number (moles per second),
  "avg_speed": Number,
  "status": String (enum: "completed", "abandoned", "timeout"),
  "game_date": Date,
  "created_at": Date (auto-generated),
  "updated_at": Date (auto-generated),
  "__v": Number
}
```

**Indexes:**
- clerk_user_id (indexed)
- game_date (indexed for trending)

---

### 5. **memory_card_games** Collection (Games Backend)
Memory Card game session records.

```json
{
  "_id": ObjectId,
  "clerk_user_id": String (indexed, required),
  "patient_id": ObjectId (optional, references patients._id),
  "final_matches": Number (pairs matched),
  "total_moves": Number,
  "best_moves": Number,
  "time_taken": Number (seconds),
  "best_time": Number (seconds),
  "accuracy": Number (0-100, calculated as final_matches / total_moves * 100),
  "difficulty": String (enum: "easy", "medium", "hard"),
  "status": String (enum: "completed", "abandoned", "timeout"),
  "game_date": Date,
  "created_at": Date (auto-generated),
  "updated_at": Date (auto-generated),
  "__v": Number
}
```

**Indexes:**
- clerk_user_id (indexed)
- game_date (indexed for trending)

---

## Database Connection

**Environment Variable:** `MONGODB_URI`

**Format:** `mongodb+srv://username:password@cluster.mongodb.net/database_name?retryWrites=true&w=majority`

**Used by:** 
- Main backend (`backend/`)
- Games backend (`games-backend/`)

Both services connect to the same MongoDB instance using the same `MONGODB_URI`.

---

## Key Field Mapping

| Collection | User Reference | Link Field |
|-----------|---|---|
| users | Primary | clerkId |
| patients | Secondary | clerk_user_id |
| physical_vitals | Tertiary | patient_id (string) |
| whack_a_mole_games | Tertiary | clerk_user_id + patient_id |
| memory_card_games | Tertiary | clerk_user_id + patient_id |

---

## Authentication Flow

1. **Clerk** provides `clerkId` on user login
2. **Frontend** sends `clerkId` to backend
3. **Backend** uses `clerkId` to:
   - Look up user in `users` collection
   - Look up extended profile in `patients` collection (via clerk_user_id)
   - Link game records to user's profile
