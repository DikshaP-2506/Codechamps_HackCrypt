# Medical Documents Upload & View System - Testing Guide

## 📋 Overview
Complete Cloudinary-integrated document management system connecting:
- **Patients** → Upload their own documents
- **Lab Reporters** → Upload documents for specific patients  
- **Doctors** → View all documents for their patients

---

## 🎯 Features Created

### 1. **Patient Upload Page**
📍 Location: `/patient/documents`
- Upload personal medical documents
- View own uploaded documents
- Download/View documents
- Cloudinary integration for storage

### 2. **Lab Reporter Upload Page**
📍 Location: `/lab-reporter/upload-document`
- Search and select patient
- Upload lab reports/medical documents
- Add metadata (test date, priority, notes)
- View recent uploads
- Cloudinary integration

### 3. **Doctor View Page**
📍 Location: `/doctor/patient-documents`
- Search patients
- View all patient documents
- Filter by document type and category
- View/Download documents
- See upload metadata and priority

---

## 🧪 Testing Flow

### **Step 1: Test Backend APIs (Postman)**

#### 1.1 Upload Document (Lab Reporter)
```http
POST http://localhost:5001/api/medical-documents/upload
Content-Type: multipart/form-data

Form Data:
- file: [select a PDF or image file]
- patient_id: 9897
- uploaded_by: 9097
- document_type: Lab Report
- category: lab_results
- description: Blood test results - Normal range
```

#### 1.2 Get Patient Documents
```http
GET http://localhost:5001/api/medical-documents/patient/9897
```

#### 1.3 Get All Documents
```http
GET http://localhost:5001/api/medical-documents?limit=20
```

---

### **Step 2: Test Frontend Pages**

#### 2.1 Patient Upload
1. Navigate to: `http://localhost:3000/patient/documents`
2. Select a file (PDF/Image)
3. Choose document type
4. Add description
5. Click "Upload Document"
6. ✅ Verify document appears in list

#### 2.2 Lab Reporter Upload
1. Navigate to: `http://localhost:3000/lab-reporter/upload-document`
2. Search for patient: "Patient Name" or ID
3. Select patient from results
4. Select file to upload
5. Fill document details:
   - Document Type
   - Category
   - Test Date
   - Priority
   - Notes
6. Click "Upload Document"
7. ✅ Verify appears in recent uploads

#### 2.3 Doctor View
1. Navigate to: `http://localhost:3000/doctor/patient-documents`
2. Search for patient
3. Select patient
4. ✅ View all documents for that patient
5. Apply filters (document type, category)
6. Click "View" to open document
7. Click "Download" to download

---

## 🔄 Complete E2E Test Scenario

### Scenario: Lab Test Results Workflow

**Step 1: Lab Reporter Uploads Results**
```
1. Lab reporter logs in
2. Goes to upload page
3. Searches for "Patient Name"
4. Uploads blood test PDF
5. Sets:
   - Type: Blood Test
   - Category: Lab Results
   - Priority: Urgent
   - Notes: "Elevated cholesterol levels"
```

**Step 2: Patient Views Results**
```
1. Patient logs in
2. Goes to documents page
3. ✅ Sees newly uploaded blood test
4. Clicks "View" to see results
```

**Step 3: Doctor Reviews Results**
```
1. Doctor logs in
2. Goes to patient documents
3. Searches for patient
4. Selects patient
5. ✅ Sees blood test with "URGENT" badge
6. Clicks "View" to review
7. Adds prescription based on results
```

---

## 🗂️ File Structure Created

```
frontend/src/app/
├── patient/
│   └── documents/
│       └── page.tsx          # Patient upload/view page
├── lab-reporter/
│   └── upload-document/
│       └── page.tsx          # Lab reporter upload page
└── doctor/
    └── patient-documents/
        └── page.tsx          # Doctor view page
```

---

## 🌐 API Endpoints Used

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/medical-documents/upload` | POST | Upload document to Cloudinary |
| `/api/medical-documents/patient/:id` | GET | Get all documents for patient |
| `/api/medical-documents/:id` | GET | Get single document |
| `/api/patients?search=query` | GET | Search patients |

---

## ✅ Verification Checklist

### Backend Checks
- [ ] Server running on port 5001
- [ ] MongoDB connected
- [ ] Cloudinary credentials configured in `.env`
- [ ] Multer middleware working
- [ ] Files uploading to Cloudinary

### Frontend Checks
- [ ] Patient can upload documents
- [ ] Lab reporter can search patients
- [ ] Lab reporter can upload for patients
- [ ] Doctor can view patient documents
- [ ] Filters working correctly
- [ ] View/Download buttons functional

### Database Checks
```javascript
// Check in MongoDB
db.medical_documents.find({ patient_id: "9897" })

// Should show:
// - file_url (Cloudinary URL)
// - cloudinary_public_id
// - uploaded_by
// - document_type
// - category
```

---

## 🐛 Common Issues & Solutions

### Issue 1: Upload fails with CORS error
**Solution:** Check backend CORS configuration in `server.js`
```javascript
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

### Issue 2: Cloudinary upload fails
**Solution:** Verify `.env` credentials:
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Issue 3: Documents not showing
**Solution:** Check patient_id matches between:
- Clerk user ID
- Patient profile in DB
- Document patient_id field

### Issue 4: File too large
**Solution:** Check multer limits in `config/multer.js`
```javascript
limits: { fileSize: 10 * 1024 * 1024 } // 10MB
```

---

## 📊 Test Data

### Sample Patient IDs
```javascript
// Use these for testing
patient_id: "9897"
patient_id: "9098"
patient_id: "6543"
```

### Sample Lab Reporter ID
```javascript
uploaded_by: "9097"
```

---

## 🚀 Quick Test Commands

### Start Backend
```bash
cd backend
npm start
# Should run on http://localhost:5001
```

### Start Frontend
```bash
cd frontend
npm run dev
# Should run on http://localhost:3000
```

### Test Upload via cURL
```bash
curl -X POST http://localhost:5001/api/medical-documents/upload \
  -F "file=@test.pdf" \
  -F "patient_id=9897" \
  -F "uploaded_by=9097" \
  -F "document_type=Lab Report" \
  -F "category=lab_results"
```

---

## 📸 Expected Results

### After Upload:
1. ✅ File stored in Cloudinary
2. ✅ Database record created with Cloudinary URL
3. ✅ Document visible in patient's list
4. ✅ Document visible to doctor

### Cloudinary URL Format:
```
https://res.cloudinary.com/[cloud_name]/image/upload/v[timestamp]/[public_id]
```

---

## 🎉 Success Criteria

- [x] Patient can upload documents
- [x] Lab reporter can upload for patients
- [x] Doctor can view all patient documents
- [x] Files stored in Cloudinary
- [x] Database records created correctly
- [x] View/Download buttons work
- [x] Filters work correctly
- [x] Metadata (priority, notes) displayed

---

## 📞 Support

If issues persist:
1. Check browser console for errors
2. Check backend logs
3. Verify Cloudinary dashboard for uploads
4. Check MongoDB for document records
