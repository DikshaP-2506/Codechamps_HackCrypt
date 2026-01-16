# Patient Management Backend API

A comprehensive RESTful API for managing patient profiles with support for demographics, medical history, allergies, chronic conditions, surgeries, family history, and emergency contacts.

## Features

- ✅ Complete CRUD operations for patient profiles
- ✅ Auto-save functionality for form wizards
- ✅ Comprehensive patient data including:
  - Demographics (name, DOB, contact info, address)
  - Medical history (physician, insurance, immunizations, medications)
  - Allergies with severity tracking
  - Chronic conditions management
  - Past surgeries records
  - Family medical history
  - Emergency contacts
- ✅ Profile completion percentage tracking
- ✅ Input validation and error handling
- ✅ Search and pagination support
- ✅ Rate limiting and security features
- ✅ MongoDB database integration

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)

### Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
   - Open `.env` file
   - Update `MONGODB_URI` with your database connection string:
     - For local MongoDB: `mongodb://localhost:27017/patient_management`
     - For MongoDB Atlas: `mongodb+srv://<username>:<password>@<cluster>.mongodb.net/patient_management`

4. Start the server:

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Health Check
- `GET /health` - Check server status

### Patient Profile Routes

#### Get All Patients
```
GET /api/patients
Query Parameters:
  - page: Page number (default: 1)
  - limit: Items per page (default: 10)
  - search: Search by name, email, or phone
  - sortBy: Field to sort by (default: 'createdAt')
  - order: Sort order 'asc' or 'desc' (default: 'desc')
```

#### Get Patient by ID
```
GET /api/patients/:id
```

#### Create New Patient
```
POST /api/patients
Body: Patient profile object (see schema below)
```

#### Update Patient
```
PUT /api/patients/:id
Body: Complete or partial patient profile object
```

#### Auto-Save Patient (Partial Update)
```
PATCH /api/patients/:id/autosave
Body: Partial patient profile object
```

#### Delete Patient
```
DELETE /api/patients/:id
```

#### Get Patient Statistics
```
GET /api/patients/stats/overview
```

### Sub-Document Routes

#### Add Allergy
```
POST /api/patients/:id/allergies
Body: {
  "allergen": "Penicillin",
  "reaction": "Skin rash",
  "severity": "Moderate",
  "diagnosedDate": "2023-01-15",
  "notes": "Avoid all penicillin-based antibiotics"
}
```

#### Add Chronic Condition
```
POST /api/patients/:id/chronic-conditions
Body: {
  "condition": "Type 2 Diabetes",
  "diagnosedDate": "2020-05-10",
  "status": "Controlled",
  "treatment": "Metformin 500mg twice daily",
  "notes": "Regular HbA1c monitoring required"
}
```

#### Add Surgery
```
POST /api/patients/:id/surgeries
Body: {
  "surgeryName": "Appendectomy",
  "surgeryDate": "2019-03-15",
  "hospital": "City General Hospital",
  "surgeon": "Dr. Smith",
  "complications": "None",
  "notes": "Recovery was smooth"
}
```

#### Add Family History
```
POST /api/patients/:id/family-history
Body: {
  "relationship": "Father",
  "condition": "Hypertension",
  "ageOfOnset": 45,
  "status": "Living",
  "notes": "Currently on medication"
}
```

#### Add Emergency Contact
```
POST /api/patients/:id/emergency-contacts
Body: {
  "name": "John Doe",
  "relationship": "Spouse",
  "phoneNumber": "+1-234-567-8900",
  "email": "john.doe@example.com",
  "address": "123 Main St, City, State",
  "isPrimary": true
}
```

## Patient Profile Schema

```json
{
  "demographics": {
    "firstName": "string (required)",
    "lastName": "string (required)",
    "middleName": "string",
    "dateOfBirth": "date (required)",
    "gender": "enum: Male/Female/Other/Prefer not to say (required)",
    "bloodType": "enum: A+/A-/B+/B-/AB+/AB-/O+/O-/Unknown",
    "maritalStatus": "enum: Single/Married/Divorced/Widowed/Separated",
    "occupation": "string",
    "email": "string (required, unique)",
    "phoneNumber": "string (required)",
    "alternatePhoneNumber": "string",
    "address": {
      "street": "string",
      "city": "string",
      "state": "string",
      "zipCode": "string",
      "country": "string"
    }
  },
  "medicalHistory": {
    "primaryPhysician": {
      "name": "string",
      "phoneNumber": "string",
      "specialization": "string"
    },
    "insuranceInfo": {
      "provider": "string",
      "policyNumber": "string",
      "groupNumber": "string",
      "expiryDate": "date"
    },
    "immunizations": [
      {
        "vaccineName": "string",
        "dateAdministered": "date",
        "nextDueDate": "date"
      }
    ],
    "medications": [
      {
        "medicationName": "string",
        "dosage": "string",
        "frequency": "string",
        "prescribedBy": "string",
        "startDate": "date",
        "endDate": "date"
      }
    ]
  },
  "allergies": [
    {
      "allergen": "string (required)",
      "reaction": "string (required)",
      "severity": "enum: Mild/Moderate/Severe/Life-threatening (required)",
      "diagnosedDate": "date",
      "notes": "string"
    }
  ],
  "chronicConditions": [
    {
      "condition": "string (required)",
      "diagnosedDate": "date (required)",
      "status": "enum: Active/Controlled/In Remission/Resolved",
      "treatment": "string",
      "notes": "string"
    }
  ],
  "pastSurgeries": [
    {
      "surgeryName": "string (required)",
      "surgeryDate": "date (required)",
      "hospital": "string",
      "surgeon": "string",
      "complications": "string",
      "notes": "string"
    }
  ],
  "familyHistory": [
    {
      "relationship": "string (required)",
      "condition": "string (required)",
      "ageOfOnset": "number",
      "status": "enum: Living/Deceased",
      "notes": "string"
    }
  ],
  "emergencyContacts": [
    {
      "name": "string (required)",
      "relationship": "string (required)",
      "phoneNumber": "string (required)",
      "email": "string",
      "address": "string",
      "isPrimary": "boolean"
    }
  ],
  "additionalInfo": {
    "smokingStatus": "enum: Never/Former/Current/Unknown",
    "alcoholConsumption": "enum: None/Occasional/Moderate/Heavy/Unknown",
    "exerciseFrequency": "enum: None/Rarely/Weekly/Daily/Unknown",
    "dietaryPreferences": "string",
    "notes": "string"
  }
}
```

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "errors": [ ... ]
}
```

## Security Features

- Helmet.js for security headers
- CORS configuration
- Rate limiting (100 requests per 15 minutes)
- Input validation and sanitization
- MongoDB injection protection

## Database

The application uses MongoDB with Mongoose ODM. The database connection is configured in `/config/database.js`.

### Collections
- `patientprofiles` - Main collection storing all patient data

### Indexes
- Email (unique)
- Phone number
- Created/Updated timestamps

## Error Handling

The API includes comprehensive error handling for:
- Validation errors
- Database errors
- Duplicate key errors
- Invalid ID format
- 404 Not Found
- 500 Internal Server Error

## Auto-Save Feature

The auto-save endpoint (`PATCH /api/patients/:id/autosave`) is designed for form wizards and allows partial updates without strict validation. It automatically updates the `lastAutoSave` timestamp.

## Profile Completion Tracking

Each patient profile automatically calculates a completion percentage based on:
- Demographics (required fields)
- Emergency contacts
- Medical history
- Allergies
- Chronic conditions
- Family history

The `isComplete` flag is set to true when all essential fields are filled.

## Development

### Project Structure
```
backend/
├── config/
│   └── database.js          # Database configuration
├── controllers/
│   └── patientController.js # Business logic
├── middleware/
│   └── validators.js        # Request validation
├── models/
│   └── PatientProfile.js    # Mongoose schema
├── routes/
│   └── patientRoutes.js     # API routes
├── .env                      # Environment variables
├── .gitignore
├── package.json
├── server.js                 # Entry point
└── README.md
```

## Testing with Postman/Thunder Client

Import the following example requests:

1. Create Patient:
```json
POST http://localhost:5000/api/patients
{
  "demographics": {
    "firstName": "John",
    "lastName": "Doe",
    "dateOfBirth": "1990-01-15",
    "gender": "Male",
    "email": "john.doe@example.com",
    "phoneNumber": "+1-234-567-8900"
  },
  "emergencyContacts": [
    {
      "name": "Jane Doe",
      "relationship": "Spouse",
      "phoneNumber": "+1-234-567-8901",
      "isPrimary": true
    }
  ]
}
```

2. Get All Patients:
```
GET http://localhost:5000/api/patients?page=1&limit=10
```

3. Auto-Save:
```json
PATCH http://localhost:5000/api/patients/{id}/autosave
{
  "demographics": {
    "bloodType": "A+"
  }
}
```

## Support

For issues or questions, please create an issue in the repository.

## License

ISC
