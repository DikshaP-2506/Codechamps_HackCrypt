# AI Mental Health Chatbot - Implementation Plan

## Overview
Building a mental health chatbot using LangChain + Groq API with session memory and patient data integration.

---

## Architecture

### Folder Structure (MINIMAL)
```
ai-backend/
├── server.js      # Everything in one file (Express + LangChain + routes)
├── package.json   # Dependencies
└── .env           # API keys
```

**That's it! Just 3 files total.**

---

## Key Components

### 1. Session Memory (LangChain)
- **Tool**: `BufferMemory` from LangChain (simplest option)
- **Storage**: JavaScript Map object (in-memory)
- **How it works**: 
  ```
  sessions = {
    "user_123_session_456": [
      { role: "user", content: "I feel anxious" },
      { role: "assistant", content: "I understand..." }
    ]
  }
  ```
- LangChain automatically sends last 10 messages as context

### 2. Patient Data Fetching (COMPREHENSIVE)
**When user clicks "Fetch My Data":**

Fetch ALL available data for logged-in patient from MongoDB collections:

**Collections fetched:**
1. `patients` - Profile (name, age, gender, blood group, conditions, allergies, surgeries, family history)
2. `physical_vitals` - All vitals records (BP, heart rate, temperature, SpO2, weight, BMI, blood sugar)
3. `prescription` - All prescriptions (active + completed with medications, dosage, frequency)
4. `appointments` - All appointments (past + upcoming, status, notes)
5. `mental_health_logs` - All mood/anxiety logs (mood score, stress level, sleep hours, PHQ9, GAD7)
6. `therapy_sessions` - All therapy sessions (type, notes, progress score)
7. `treatment_plans` - All treatment plans (conditions, goals, medications, lifestyle instructions)
8. `wellness_sessions` - Wellness/meditation sessions completed
9. `medication_adherence` - Medication taking history
10. `health_alerts` - Any health alerts triggered
11. `notifications` - Recent notifications

**Data sent to AI (formatted):**
```
PATIENT PROFILE:
Name: John Doe, Age: 45, Gender: Male, Blood: O+
Chronic Conditions: Diabetes, Hypertension
Allergies: Penicillin
Past Surgeries: Appendectomy (2020)
Family History: Heart disease

LATEST VITALS:
BP: 140/90, HR: 85, Temp: 98.6°F, SpO2: 95%, Weight: 180lbs, BMI: 26.5
Blood Sugar: 145 mg/dL

ACTIVE MEDICATIONS:
- Metformin 500mg, Twice daily, Since Jan 2026
- Lisinopril 10mg, Once daily, Since Dec 2025

RECENT APPOINTMENTS (3):
- Jan 10, 2026: Dr. Smith - Routine checkup (Completed)
- Jan 15, 2026: Dr. Johnson - Follow-up (Completed)
- Jan 20, 2026: Dr. Smith - Scheduled

MENTAL HEALTH (Last 7 days):
Avg Mood: 6.5/10, Stress: Medium, Anxiety: Low
Sleep: 7.2 hrs/night avg, PHQ9: 8, GAD7: 6

THERAPY SESSIONS (2):
- Jan 5: CBT session, Progress: 7/10
- Dec 28: Stress management, Progress: 8/10

TREATMENT PLAN:
Condition: Type 2 Diabetes
Goals: HbA1c < 7%, Weight loss 10lbs
Monitoring: Daily blood sugar checks
```

**If data not found**: Show "No data available" for that section

### 3. Mental Health Prompt Design

**System Prompt:**
```
You are Dr. Mindwell, a compassionate and professional mental health assistant for the HackCrypt Health Platform.

Your role:
- Provide empathetic, non-judgmental support
- Help users track their mental health
- Suggest coping strategies and self-care tips
- Recognize crisis situations and recommend professional help
- NEVER diagnose or prescribe medication
- Always encourage users to consult licensed therapists for serious concerns

Guidelines:
- Be warm, friendly, and supportive
- Use simple, clear language
- Ask follow-up questions to understand their feelings
- Validate their emotions
- Suggest practical coping techniques (breathing exercises, journaling, mindfulness)
- If detecting crisis keywords (suicide, self-harm, severe depression), provide crisis hotline numbers

When patient data is provided:
- Reference their health conditions if relevant to mental health
- Consider how physical health (vitals, medications) may affect mood
- Acknowledge their ongoing treatments and appointments
```

**Crisis Detection Keywords:**
- suicide, kill myself, self-harm, want to die, hopeless, worthless
- **Response**: "I'm really concerned about what you're sharing. Please reach out to a crisis hotline immediately: National Suicide Prevention Lifeline: 988 or 1-800-273-8255. You can also text HOME to 741741. Your life matters."

---

## API Flow

### POST `/api/chat/message`
**Request:**
```json
{
  "sessionId": "user_123_session_456",
  "message": "I've been feeling really anxious lately",
  "userId": "user_123"
}
```

**Response:**
```json
{
  "success": true,
  "reply": "I'm sorry to hear you're feeling anxious. Anxiety can be really overwhelming...",
  "sessionId": "user_123_session_456"
}
```

### POST `/api/chat/fetch-data`
**Request:**
```json
{
  "sessionId": "user_123_session_456",
  "userId": "user_123",
  "clerkUserId": "clerk_abc123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Your complete health data has been loaded",
  "dataFetched": {
    "profile": true,
    "vitals": 15,
    "prescriptions": 8,
    "appointments": 12,
    "mentalHealthLogs": 25,
    "therapySessions": 6,
    "treatmentPlans": 2,
    "wellnessSessions": 10,
    "medicationAdherence": 45,
    "healthAlerts": 3,
    "notifications": 20
  }
}
```

---

## Tech Stack (MINIMAL)

### Dependencies (Only 5!)
```json
{
  "@langchain/groq": "^0.0.14",      // Groq integration
  "langchain": "^0.1.30",            // Chat memory
  "express": "^4.18.2",              // API server
  "cors": "^2.8.5",                  // Frontend access
  "dotenv": "^16.3.1"                // Environment vars
}
```

**MongoDB**: Use existing connection from main backend (no driver needed)

### Groq API
- **Model**: `mixtral-8x7b-32768` (fast + good quality)
- **Temperature**: 0.7
- **Max Tokens**: 1024

---

## Implementation Steps (SIMPLE)

1. ✅ Create ai-backend folder with 3 files
2. ✅ npm install (5 packages)
3. ✅ Write server.js (all code in one file ~200 lines)
4. ✅ Test with curl/Postman
5. ✅ Connect frontend

**Total time: ~2 hours**

---

## Environment Variables (.env)
```
GROQ_API_KEY=gsk_your_key_here
MAIN_BACKEND_URL=http://localhost:5000
PORT=5001
```

**That's all we need!**

---

## Frontend Changes Needed

1. Update "Fetch My Data" button to call `POST http://localhost:5001/api/chat/fetch-data`
2. Send chat messages to `POST http://localhost:5001/api/chat/message`
3. Generate session ID once: `const sessionId = userId + "_" + Date.now()`
4. Store sessionId in React state
5. Pass sessionId + userId with every request

**Done! That's the complete plan.**

