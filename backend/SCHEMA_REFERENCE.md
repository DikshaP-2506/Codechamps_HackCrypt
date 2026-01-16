# Patient Profile Database Schema Reference

This document describes the simplified patient profile schema that matches your database table structure.

## Database Table: PATIENTS

### Fields

| Field Name | Type | Constraints | Description |
|-----------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Auto-generated MongoDB ObjectId |
| `user_id` | UUID | FOREIGN KEY | Reference to User table (optional) |
| `primary_doctor_id` | UUID | FOREIGN KEY | Reference to Doctor table (optional) |
| `name` | String | REQUIRED, max 100 chars | Patient's full name |
| `date_of_birth` | Date | REQUIRED | Patient's date of birth |
| `gender` | String | REQUIRED | Male, Female, Other, or Prefer not to say |
| `blood_group` | String | OPTIONAL | A+, A-, B+, B-, AB+, AB-, O+, O-, Unknown |
| `emergency_contact_phone` | String | REQUIRED | Emergency contact phone number |
| `address` | Text | OPTIONAL, max 500 chars | Full address as text |
| `allergies` | Text[] | Array of strings | List of allergies as text entries |
| `chronic_conditions` | Text[] | Array of strings | List of chronic conditions as text entries |
| `past_surgeries` | Text[] | Array of strings | List of past surgeries as text entries |
| `family_history` | Text[] | Array of strings | List of family medical history as text entries |
| `is_active` | Boolean | DEFAULT: true | Patient profile active status |
| `created_at` | Timestamp | AUTO | Record creation timestamp |
| `updated_at` | Timestamp | AUTO | Record last update timestamp |

## MongoDB Schema Structure

```javascript
{
  user_id: ObjectId (ref: 'User'),
  primary_doctor_id: ObjectId (ref: 'Doctor'),
  name: String,
  date_of_birth: Date,
  gender: String,
  blood_group: String,
  emergency_contact_phone: String,
  address: String,
  allergies: [String],
  chronic_conditions: [String],
  past_surgeries: [String],
  family_history: [String],
  is_active: Boolean,
  created_at: Date,
  updated_at: Date
}
```

## Example Patient Record

```json
{
  "name": "John Michael Doe",
  "date_of_birth": "1990-01-15",
  "gender": "Male",
  "blood_group": "A+",
  "emergency_contact_phone": "+91-98765-43210",
  "address": "123 Main Street, Apartment 4B, Mumbai, Maharashtra 400001, India",
  "allergies": [
    "Penicillin - Skin rash and itching (Moderate severity)",
    "Peanuts - Anaphylaxis (Life-threatening)"
  ],
  "chronic_conditions": [
    "Hypertension - Diagnosed 2020-05-10, Status: Controlled, Treatment: Amlodipine 5mg daily",
    "Type 2 Diabetes - Diagnosed 2022-03-15, Status: Active, Treatment: Metformin 500mg twice daily"
  ],
  "past_surgeries": [
    "Appendectomy - Performed 2015-08-20 at Lilavati Hospital by Dr. Patel (Laparoscopic)",
    "Wisdom Tooth Extraction - Performed 2022-11-20 at Dental Care Clinic by Dr. Kumar"
  ],
  "family_history": [
    "Father - Type 2 Diabetes, Age of Onset: 55, Status: Living",
    "Mother - Osteoporosis, Age of Onset: 60, Status: Living",
    "Paternal Grandfather - Heart Disease, Age of Onset: 65, Status: Deceased at 70"
  ],
  "is_active": true
}
```

## API Endpoints

### Create Patient
**POST** `/api/patients`
- Creates a new patient profile
- All required fields must be provided
- Returns created patient with auto-generated ID and timestamps

### Get All Patients
**GET** `/api/patients`
- Query parameters:
  - `page`: Page number (default: 1)
  - `limit`: Results per page (default: 10)
  - `search`: Search by name or phone
  - `is_active`: Filter by active status (true/false)
  - `sortBy`: Field to sort by (default: created_at)
  - `order`: Sort order asc/desc (default: desc)

### Get Patient by ID
**GET** `/api/patients/:id`
- Returns single patient profile
- Populates user_id and primary_doctor_id references

### Update Patient
**PUT** `/api/patients/:id`
- Updates entire patient profile
- All required fields must be provided

### Auto-Save (Partial Update)
**PATCH** `/api/patients/:id/autosave`
- Updates only provided fields
- Useful for form wizard auto-save functionality

### Delete Patient
**DELETE** `/api/patients/:id`
- Permanently deletes patient profile

### Add to Arrays
- **POST** `/api/patients/:id/allergies` - Add single allergy
- **POST** `/api/patients/:id/chronic-conditions` - Add single condition
- **POST** `/api/patients/:id/surgeries` - Add single surgery
- **POST** `/api/patients/:id/family-history` - Add single family history entry

### Statistics
**GET** `/api/patients/stats/overview`
- Returns:
  - Total patients
  - Active patients
  - Inactive patients
  - Blood group distribution
  - Recent patients (last 5)

## Virtual Fields

### age
Automatically calculated from `date_of_birth`
- Returns current age in years
- Accessible in JSON responses

## Indexes

For optimal query performance, the following indexes are created:
- `user_id`
- `primary_doctor_id`
- `name`
- `is_active`
- `created_at` (descending)
- `updated_at` (descending)

## Validation Rules

### Required Fields
- `name`: Must be 1-100 characters
- `date_of_birth`: Must be a valid past date (not future, not >150 years ago)
- `gender`: Must be one of: Male, Female, Other, Prefer not to say
- `emergency_contact_phone`: Must be valid phone format

### Optional Fields
- `blood_group`: If provided, must be valid blood type
- `address`: Max 500 characters
- `user_id`, `primary_doctor_id`: Must be valid ObjectIds if provided
- `is_active`: Must be boolean (defaults to true)

### Arrays
- All array fields (allergies, chronic_conditions, past_surgeries, family_history) accept strings
- No nested objects in arrays - all stored as formatted text
- Empty arrays are allowed

## Soft Delete Pattern

Instead of hard deleting records, use the `is_active` flag:

```javascript
// Deactivate patient
PATCH /api/patients/:id/autosave
{
  "is_active": false
}

// Filter active patients only
GET /api/patients?is_active=true
```

## Format Recommendations

### Allergies
Format: `"[Allergen] - [Reaction] ([Severity])"`
Example: `"Penicillin - Skin rash (Moderate severity)"`

### Chronic Conditions
Format: `"[Condition] - Diagnosed [Date], Status: [Status], Treatment: [Treatment]"`
Example: `"Hypertension - Diagnosed 2020-05-10, Status: Controlled, Treatment: Amlodipine 5mg daily"`

### Past Surgeries
Format: `"[Surgery] - Performed [Date] at [Hospital] by [Surgeon]"`
Example: `"Appendectomy - Performed 2015-08-20 at Lilavati Hospital by Dr. Patel"`

### Family History
Format: `"[Relation] - [Condition], Age of Onset: [Age], Status: [Living/Deceased]"`
Example: `"Father - Type 2 Diabetes, Age of Onset: 55, Status: Living"`

## Notes

- This simplified schema stores medical information as text strings rather than nested objects
- Easier to query and index
- Frontend can parse and format the text as needed
- Maintains flexibility while keeping the database structure clean
- Perfect for MVP and can be extended later if needed
