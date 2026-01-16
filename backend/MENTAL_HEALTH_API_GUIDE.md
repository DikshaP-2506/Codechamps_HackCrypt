# Mental Health API - Postman Testing Guide

## Base URL
```
http://localhost:5000/api/mental-health
```

---

## 📋 API ENDPOINTS

### 1. PATIENT FEATURES

#### 1.1 Quick Mood Log (Daily Mood Entry)
**Endpoint:** `POST /api/mental-health/quick-log`

**Description:** Simple daily mood logging with emoji support

**Request Body:**
```json
{
  "patient_id": "9897",
  "mood_rating": 8,
  "stress_level": "Low",
  "anxiety_level": "Low",
  "notes": "Feeling great today! Had a productive morning."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Mood logged successfully! 🎉",
  "data": {
    "_id": "65f00000000000000000901",
    "patient_id": "9897",
    "recorded_by": "9897",
    "recorded_date": "2026-01-16T10:30:00.000Z",
    "mood_rating": 8,
    "mood_score": 8,
    "stress_level": "Low",
    "anxiety_level": "Low",
    "notes": "Feeling great today! Had a productive morning."
  },
  "emoji": "😄"
}
```

**Mood Rating Scale:**
- 1-2: 😢 Very Sad
- 3-4: 😕 Sad
- 5: 😐 Neutral
- 6-7: 😊 Happy
- 8-9: 😄 Very Happy
- 10: 🤩 Excellent

---

#### 1.2 Full Mental Health Log Entry
**Endpoint:** `POST /api/mental-health`

**Description:** Comprehensive mental health entry with surveys

**Request Body:**
```json
{
  "patient_id": "9897",
  "recorded_by": "9097",
  "mood_score": 7,
  "mood_rating": 8,
  "stress_level": "medium",
  "anxiety_level": "medium",
  "sleep_hours": 7.5,
  "sleep_quality": 8,
  "gad7_score": 5,
  "phq9_score": 6,
  "notes": "Patient feeling stable"
}
```

**GAD-7 Score (Anxiety):**
- 0-4: Minimal anxiety
- 5-9: Mild anxiety
- 10-14: Moderate anxiety
- 15-21: Severe anxiety

**PHQ-9 Score (Depression):**
- 0-4: Minimal depression
- 5-9: Mild depression
- 10-14: Moderate depression
- 15-19: Moderately severe depression
- 20-27: Severe depression

**Response:**
```json
{
  "success": true,
  "message": "Mental health log created successfully",
  "data": {
    "_id": "65f00000000000000000901",
    "patient_id": "9897",
    "recorded_by": "9097",
    "recorded_date": "2026-01-16T00:00:00.000Z",
    "mood_score": 7,
    "mood_rating": 8,
    "stress_level": "medium",
    "anxiety_level": "medium",
    "sleep_hours": 7.5,
    "sleep_quality": 8,
    "gad7_score": 5,
    "phq9_score": 6,
    "notes": "Patient feeling stable",
    "mood_emoji": "😄",
    "gad7_severity": "Mild",
    "phq9_severity": "Mild"
  }
}
```

---

#### 1.3 Get Recent Mood Logs (Last 7 Days)
**Endpoint:** `GET /api/mental-health/recent/:patientId`

**Example:** `GET /api/mental-health/recent/9897`

**Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "65f00000000000000000905",
      "patient_id": "9897",
      "mood_rating": 8,
      "stress_level": "Low",
      "recorded_date": "2026-01-16T00:00:00.000Z",
      "mood_emoji": "😄"
    },
    {
      "_id": "65f00000000000000000904",
      "patient_id": "9897",
      "mood_rating": 7,
      "stress_level": "Medium",
      "recorded_date": "2026-01-15T00:00:00.000Z",
      "mood_emoji": "😃"
    }
  ]
}
```

---

### 2. DOCTOR FEATURES

#### 2.1 Get All Mental Health Logs for Patient
**Endpoint:** `GET /api/mental-health/patient/:patientId`

**Query Parameters:**
- `startDate` (optional): Filter from date (YYYY-MM-DD)
- `endDate` (optional): Filter to date (YYYY-MM-DD)
- `limit` (optional): Number of records (default: 50)

**Example:** `GET /api/mental-health/patient/9897?startDate=2026-01-01&limit=10`

**Response:**
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "_id": "65f00000000000000000901",
      "patient_id": "9897",
      "recorded_by": "9097",
      "recorded_date": "2026-01-15T00:00:00.000Z",
      "mood_score": 7,
      "mood_rating": 8,
      "stress_level": "Low",
      "anxiety_level": "medium",
      "sleep_hours": 7.5,
      "sleep_quality": 8,
      "gad7_score": 5,
      "phq9_score": 6,
      "notes": "Patient feeling stable",
      "mood_emoji": "😄",
      "gad7_severity": "Mild",
      "phq9_severity": "Mild"
    }
  ],
  "statistics": {
    "avgMoodRating": 7.8,
    "avgSleepHours": 7.2,
    "avgSleepQuality": 7.5,
    "avgGad7Score": 5.3,
    "avgPhq9Score": 6.1,
    "totalLogs": 10,
    "lowStressCount": 6,
    "mediumStressCount": 3,
    "highStressCount": 1
  }
}
```

---

#### 2.2 Get Mental Health Analytics
**Endpoint:** `GET /api/mental-health/analytics/:patientId`

**Query Parameters:**
- `period` (optional): Number of days to analyze (default: 30)

**Example:** `GET /api/mental-health/analytics/9897?period=30`

**Response:**
```json
{
  "success": true,
  "data": {
    "period": "30 days",
    "statistics": {
      "avgMoodRating": 7.5,
      "avgSleepHours": 7.3,
      "avgSleepQuality": 7.8,
      "avgGad7Score": 5.2,
      "avgPhq9Score": 6.0,
      "totalLogs": 25,
      "lowStressCount": 15,
      "mediumStressCount": 8,
      "highStressCount": 2
    },
    "trends": [
      {
        "_id": "2026-01-01",
        "avgMoodRating": 7,
        "avgSleepHours": 7.5,
        "avgSleepQuality": 8,
        "avgGad7": 5,
        "avgPhq9": 6
      },
      {
        "_id": "2026-01-02",
        "avgMoodRating": 8,
        "avgSleepHours": 8,
        "avgSleepQuality": 9,
        "avgGad7": 4,
        "avgPhq9": 5
      }
    ]
  }
}
```

---

#### 2.3 Get Single Mental Health Log
**Endpoint:** `GET /api/mental-health/:id`

**Example:** `GET /api/mental-health/65f00000000000000000901`

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "65f00000000000000000901",
    "patient_id": "9897",
    "recorded_by": "9097",
    "recorded_date": "2026-01-15T00:00:00.000Z",
    "mood_score": 7,
    "mood_rating": 8,
    "stress_level": "Low",
    "anxiety_level": "medium",
    "sleep_hours": 7.5,
    "sleep_quality": 8,
    "gad7_score": 5,
    "phq9_score": 6,
    "notes": "Patient feeling stable"
  }
}
```

---

#### 2.4 Update Mental Health Log
**Endpoint:** `PUT /api/mental-health/:id`

**Example:** `PUT /api/mental-health/65f00000000000000000901`

**Request Body:**
```json
{
  "notes": "Updated: Patient showing improvement",
  "gad7_score": 4,
  "phq9_score": 5
}
```

**Response:**
```json
{
  "success": true,
  "message": "Mental health log updated successfully",
  "data": {
    "_id": "65f00000000000000000901",
    "notes": "Updated: Patient showing improvement",
    "gad7_score": 4,
    "phq9_score": 5
  }
}
```

---

#### 2.5 Delete Mental Health Log
**Endpoint:** `DELETE /api/mental-health/:id`

**Example:** `DELETE /api/mental-health/65f00000000000000000901`

**Response:**
```json
{
  "success": true,
  "message": "Mental health log deleted successfully"
}
```

---

## 🧪 TESTING SCENARIOS

### Scenario 1: Patient Daily Mood Logging
```
1. POST /api/mental-health/quick-log
   - Log mood rating: 9
   - Stress: Low
   - Anxiety: Low

2. GET /api/mental-health/recent/9897
   - Verify entry appears in recent logs
```

### Scenario 2: Patient with Stress/Anxiety Survey
```
1. POST /api/mental-health
   - Include GAD-7 score: 12 (Moderate anxiety)
   - Include PHQ-9 score: 8 (Mild depression)
   - Stress level: High

2. GET /api/mental-health/patient/9897
   - Verify scores and severity levels
```

### Scenario 3: Doctor Review Patient Mental Health
```
1. GET /api/mental-health/patient/9897?startDate=2026-01-01&endDate=2026-01-16
   - Review all logs in date range
   - Check statistics

2. GET /api/mental-health/analytics/9897?period=30
   - Review 30-day trends
   - Analyze mood patterns
```

### Scenario 4: Weekly Mental Health Check
```
1. GET /api/mental-health/recent/9897
   - Get last 7 days of mood logs
   - Identify concerning patterns

2. POST /api/mental-health
   - Add comprehensive weekly assessment
   - Include sleep, GAD-7, PHQ-9 scores
```

---

## 📊 SAMPLE DATA FOR TESTING

### Happy Patient (Good Mental Health)
```json
{
  "patient_id": "9897",
  "recorded_by": "9897",
  "mood_rating": 9,
  "stress_level": "Low",
  "anxiety_level": "Low",
  "sleep_hours": 8,
  "sleep_quality": 9,
  "gad7_score": 2,
  "phq9_score": 3,
  "notes": "Feeling excellent today!"
}
```

### Patient with Moderate Anxiety
```json
{
  "patient_id": "9897",
  "recorded_by": "9097",
  "mood_rating": 5,
  "stress_level": "High",
  "anxiety_level": "High",
  "sleep_hours": 5,
  "sleep_quality": 4,
  "gad7_score": 12,
  "phq9_score": 8,
  "notes": "Patient reports increased worry and difficulty sleeping"
}
```

### Patient with Depression Symptoms
```json
{
  "patient_id": "9897",
  "recorded_by": "9097",
  "mood_rating": 3,
  "stress_level": "Medium",
  "anxiety_level": "Medium",
  "sleep_hours": 10,
  "sleep_quality": 3,
  "gad7_score": 7,
  "phq9_score": 16,
  "notes": "Patient showing signs of moderately severe depression"
}
```

---

## 🚀 QUICK START IN POSTMAN

1. **Create a Collection**: "Mental Health API"

2. **Add Environment Variables**:
   - `base_url`: http://localhost:5000
   - `patient_id`: 9897
   - `doctor_id`: 9097

3. **Test Flow**:
   ```
   Step 1: Patient logs daily mood (quick-log)
   Step 2: Get recent logs to verify
   Step 3: Doctor reviews patient logs
   Step 4: Doctor views analytics
   ```

4. **Import Collection**: Copy all endpoints above into Postman

---

## ⚠️ VALIDATION RULES

- **patient_id**: Required, String
- **recorded_by**: Required, String
- **mood_rating**: 1-10 scale
- **stress_level**: "Low", "Medium", or "High" (case-insensitive)
- **anxiety_level**: "Low", "Medium", or "High" (case-insensitive)
- **sleep_hours**: 0-24 hours
- **sleep_quality**: 1-10 scale
- **gad7_score**: 0-21
- **phq9_score**: 0-27

---

## 🔍 ERROR RESPONSES

### 400 Bad Request
```json
{
  "success": false,
  "message": "Patient ID and mood rating are required"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Mental health log not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Error creating mental health log",
  "error": "Error details here"
}
```
