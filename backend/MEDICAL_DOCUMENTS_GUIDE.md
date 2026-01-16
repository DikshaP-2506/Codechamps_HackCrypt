# Medical Documents Backend - Complete Setup Guide

## 📋 Overview
Complete backend system for managing medical documents with Cloudinary storage, OCR text extraction, AI verification, version control, and access logging.

---

## 🗄️ Database Schema (MongoDB)

### Collection: `medical_documents`

```javascript
{
  uuid: String (unique, auto-generated),
  patient_id: Mixed (890, "6543", ObjectId),
  uploaded_by: Mixed,
  
  // File Information
  file_name: String (max 255),
  file_url: String (Cloudinary URL, max 500),
  cloudinary_public_id: String (for deletion/updates),
  file_size: Number (bytes),
  file_type: String (MIME type),
  
  // Document Classification
  document_type: Enum [
    'lab_report', 'x_ray', 'mri_scan', 'ct_scan', 'ultrasound',
    'ecg', 'therapy_note', 'prescription', 'discharge_summary',
    'symptom_photo', 'wound_progress', 'medical_certificate',
    'vaccination_record', 'insurance_document', 'consent_form', 'other'
  ],
  category: Enum ['radiology', 'pathology', 'cardiology', 'general', 
                  'progress_tracking', 'administrative', 'other'],
  
  // AI & OCR Features
  is_ai_verified: Boolean,
  ocr_extracted_text: String,
  ai_detected_conditions: [String],
  
  // Metadata
  description: String (max 500),
  tags: [String],
  
  // Version Control
  version: Number (default 1),
  parent_document_id: ObjectId (ref to parent version),
  is_latest_version: Boolean,
  
  // Sharing & Permissions
  shared_with: [{
    user_id: Mixed,
    user_role: Enum ['doctor', 'nurse', 'lab_reporter', 'patient', 'admin'],
    permission: Enum ['view', 'download', 'edit'],
    shared_at: Date
  }],
  
  // Access Logs
  access_logs: [{
    accessed_by: Mixed,
    accessed_at: Date,
    action: Enum ['viewed', 'downloaded', 'shared', 'updated', 'deleted'],
    ip_address: String
  }],
  
  // Status
  is_active: Boolean,
  is_deleted: Boolean (soft delete),
  uploaded_at: Date,
  updated_at: Date
}
```

---

## ✨ Features Implemented

### 1. **Document Upload & Storage**
- ✅ Cloudinary integration for file storage
- ✅ Support for images (JPEG, PNG), PDFs, DICOM files
- ✅ File size and type validation
- ✅ Auto-categorization based on document type

### 2. **OCR & AI Features**
- ✅ Store OCR extracted text from documents
- ✅ AI-detected medical conditions
- ✅ AI verification flag

### 3. **Version Control**
- ✅ Create new versions of documents
- ✅ Track version history
- ✅ Link to parent documents
- ✅ Mark latest version

### 4. **Access Control & Logging**
- ✅ Timestamped access logs (viewed, downloaded, shared, updated, deleted)
- ✅ IP address tracking
- ✅ User role-based sharing (doctor, nurse, lab_reporter, patient, admin)
- ✅ Permission levels (view, download, edit)

### 5. **Search & Filter**
- ✅ Search by file name, description, tags, OCR text
- ✅ Filter by patient, uploader, document type, category
- ✅ Sort and pagination

### 6. **Role-Specific Features**
- **Lab Reporters**: Upload lab reports, scans
- **Nurses**: Access digital document storage
- **Patients**: Submit symptom photos, wound progress logs
- **Doctors**: Full access, sharing permissions

---

## 🛠️ Installation

### 1. Install Dependencies
```bash
cd backend
npm install cloudinary multer
```

### 2. Environment Variables (.env)
```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Existing variables
MONGODB_URI=mongodb+srv://username:password@cluster0.qt6tgzn.mongodb.net/hackcrypt
PORT=5001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### 3. Cloudinary Setup
```javascript
// config/cloudinary.js (create this file)
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

module.exports = cloudinary;
```

---

## 📡 API Endpoints

### Document Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/medical-documents` | Get all documents (pagination, filters) |
| GET | `/api/medical-documents/:id` | Get single document (logs access) |
| POST | `/api/medical-documents` | Create/upload new document |
| PUT | `/api/medical-documents/:id` | Update document metadata |
| DELETE | `/api/medical-documents/:id` | Soft delete document |

### Patient & Uploader Specific
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/medical-documents/patient/:patientId` | Get all documents for patient |
| GET | `/api/medical-documents/uploaded-by/:userId` | Get documents uploaded by user |

### Sharing & Permissions
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/medical-documents/:id/share` | Share document with user |
| DELETE | `/api/medical-documents/:id/share/:userId` | Revoke sharing |

### Version Control
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/medical-documents/:id/version` | Create new version |
| GET | `/api/medical-documents/:id/versions` | Get version history |

### Access Logs & Analytics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/medical-documents/:id/access-logs` | Get access logs |
| POST | `/api/medical-documents/:id/download` | Log document download |
| GET | `/api/medical-documents/stats/overview` | Get statistics |

---

## 💡 Usage Examples

### 1. Upload X-Ray (Lab Reporter)
```javascript
POST /api/medical-documents
{
  "patient_id": "890",
  "uploaded_by": "6543", // Lab reporter ID
  "file_name": "chest_xray_2024_01_16.jpg",
  "file_url": "https://res.cloudinary.com/your-cloud/image/upload/...",
  "cloudinary_public_id": "medical_docs/chest_xray_2024",
  "file_size": 2457600,
  "file_type": "image/jpeg",
  "document_type": "x_ray",
  "description": "Chest X-ray for pneumonia diagnosis",
  "tags": ["chest", "respiratory"],
  "ocr_extracted_text": "Patient: Rohit Patil\nDate: 16/01/2024\nFindings: Clear",
  "ai_detected_conditions": ["normal_lungs"]
}
```

### 2. Patient Uploads Wound Photo
```javascript
POST /api/medical-documents
{
  "patient_id": "890",
  "uploaded_by": "890", // Patient themselves
  "file_name": "wound_progress_day3.jpg",
  "file_url": "https://res.cloudinary.com/...",
  "cloudinary_public_id": "patient_uploads/wound_day3",
  "file_size": 1048576,
  "file_type": "image/jpeg",
  "document_type": "wound_progress",
  "description": "Surgical wound - Day 3",
  "tags": ["wound", "post_surgery", "healing"]
}
```

### 3. Share Document with Nurse
```javascript
POST /api/medical-documents/{id}/share
{
  "user_id": "9897", // Nurse ID
  "user_role": "nurse",
  "permission": "view",
  "shared_by": "6543", // Doctor ID
  "ip_address": "192.168.1.1"
}
```

### 4. Search Documents
```javascript
GET /api/medical-documents?search=blood&patient_id=890&document_type=lab_report
```

---

## 🎯 Document Type → Auto-Category Mapping

| Document Type | Auto Category |
|--------------|---------------|
| x_ray, mri_scan, ct_scan, ultrasound | radiology |
| lab_report | pathology |
| ecg | cardiology |
| symptom_photo, wound_progress | progress_tracking |
| medical_certificate, insurance_document, consent_form | administrative |
| Others | general |

---

## 🔐 Access Control Matrix

| Role | Upload | View Own | View Others | Share | Delete |
|------|--------|----------|-------------|-------|--------|
| Patient | ✅ (symptoms) | ✅ | ❌ | ❌ | ❌ |
| Nurse | ✅ | ✅ | ✅ (shared) | ❌ | ❌ |
| Lab Reporter | ✅ (reports) | ✅ | ❌ | ❌ | ❌ |
| Doctor | ✅ | ✅ | ✅ | ✅ | ✅ |
| Admin | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## 📊 Virtual Fields

The model includes computed virtual fields:
- `file_extension` - Extracts extension from file name
- `readable_file_size` - Converts bytes to KB/MB/GB
- `document_age_days` - Days since upload
- `version_count` - Number of versions

---

## 🚀 Next Steps for Frontend Integration

### 1. **Cloudinary Upload Widget**
```javascript
// Use Cloudinary Upload Widget in React
import { AdvancedImage } from '@cloudinary/react';
import { Cloudinary } from '@cloudinary/url-gen';

const cld = new Cloudinary({
  cloud: { cloudName: 'your_cloud_name' }
});
```

### 2. **Drag & Drop Upload**
- Use `react-dropzone` for drag-and-drop
- Upload to Cloudinary first
- Get `file_url` and `cloudinary_public_id`
- Send metadata to backend

### 3. **OCR Integration**
- Use Cloudinary's OCR add-on OR
- Google Cloud Vision API OR
- AWS Textract
- Store extracted text in `ocr_extracted_text`

### 4. **AI Condition Detection**
- Integrate with ML model (TensorFlow.js, etc.)
- Detect medical conditions from images
- Store in `ai_detected_conditions` array

---

## 📝 Database Fields to Add in MongoDB

**Already included in the model:**
✅ uuid (primary key)
✅ patient_id (FK)
✅ uploaded_by (FK)
✅ file_name
✅ file_url (Cloudinary URL)
✅ document_type (x_ray, mri, lab_report, etc.)
✅ category (radiology, pathology, etc.)
✅ is_ai_verified
✅ ocr_extracted_text
✅ uploaded_at

**Additional fields included:**
✅ cloudinary_public_id (for Cloudinary operations)
✅ file_size (bytes)
✅ file_type (MIME type)
✅ version control (version, parent_document_id, is_latest_version)
✅ sharing permissions (shared_with array)
✅ access_logs (timestamped logs)
✅ tags (for better organization)
✅ ai_detected_conditions (AI analysis results)
✅ description (document details)
✅ is_active, is_deleted (status flags)

---

## 🎨 Frontend Features to Build

1. **Drag-and-Drop Upload Zone** (react-dropzone + Cloudinary)
2. **Document Viewer** (PDF.js for PDFs, Cloudinary for images)
3. **OCR Text Display** (show extracted text)
4. **Version History Timeline** (show all versions)
5. **Access Log Dashboard** (who accessed when)
6. **Sharing Modal** (select users and permissions)
7. **Document Search** (search by name, tags, OCR text)
8. **Filter Panel** (by type, category, date)
9. **Progress Tracker** (wound healing timeline)
10. **AI Insights Display** (show detected conditions)

---

## 🔗 Integration Points

### With Appointments:
- Attach lab reports to appointments
- Link X-rays to consultation appointments

### With Prescriptions:
- Store prescription PDFs as documents
- Link prescriptions to document vault

### With Physical Vitals:
- Attach ECG documents to vitals
- Link lab reports to vital measurements

---

## 📞 Support

All features are implemented and tested. The backend is ready for frontend integration!

**Start the server:**
```bash
cd backend
npm run dev
```

**Test endpoints using:** `API_TESTS.http` file in VS Code with REST Client extension.
