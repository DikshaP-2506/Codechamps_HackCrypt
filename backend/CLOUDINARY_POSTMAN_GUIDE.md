# Testing Cloudinary File Upload with Postman

## Setup Instructions

### 1. Start Your Backend Server
```bash
cd backend
npm run dev
```
Server should be running on http://localhost:5001

---

## Testing File Upload to Cloudinary

### Method 1: Upload File with Cloudinary (Recommended)

**Endpoint:** `POST http://localhost:5001/api/medical-documents/upload`

**Steps in Postman:**

1. **Select Method:** POST
2. **Enter URL:** `http://localhost:5001/api/medical-documents/upload`

3. **Go to Body Tab:**
   - Select **form-data** (NOT raw or x-www-form-urlencoded)

4. **Add Form Fields:**

   | Key | Type | Value | Description |
   |-----|------|-------|-------------|
   | `file` | **File** | [Choose File] | **IMPORTANT:** Change type from "Text" to "File" using dropdown |
   | `patient_id` | Text | `60d5f9e5f1b2c72b8c8e4f1a` | Any valid patient ID |
   | `uploaded_by` | Text | `doctor_123` | Doctor/User ID |
   | `document_type` | Text | `lab_report` | See document types below |
   | `description` | Text | `Blood test results` | Optional description |
   | `tags` | Text | `blood,cholesterol,2024` | Optional comma-separated tags |

5. **Click "Send"**

**Expected Response (Success):**
```json
{
  "success": true,
  "message": "File uploaded successfully to Cloudinary",
  "data": {
    "_id": "676e123...",
    "uuid": "MD-1234567890",
    "patient_id": "60d5f9e5f1b2c72b8c8e4f1a",
    "uploaded_by": "doctor_123",
    "file_name": "test-report.pdf",
    "file_url": "https://res.cloudinary.com/dt9l4yn08/image/upload/v1234567/medical_documents/test-report_1234567890.pdf",
    "cloudinary_public_id": "medical_documents/test-report_1234567890",
    "file_size": 245678,
    "file_type": "application/pdf",
    "document_type": "lab_report",
    "category": "laboratory",
    "uploaded_at": "2026-01-16T10:30:00.000Z"
  },
  "cloudinary": {
    "url": "https://res.cloudinary.com/dt9l4yn08/...",
    "public_id": "medical_documents/test-report_1234567890",
    "format": "pdf",
    "size": 245678
  }
}
```

---

## Valid Document Types

| Document Type | Category | Examples |
|--------------|----------|----------|
| `lab_report` | laboratory | Blood tests, urine analysis |
| `radiology` | imaging | X-rays, CT scans, MRIs |
| `prescription` | medication | Prescription documents |
| `discharge_summary` | summary | Hospital discharge papers |
| `consultation_note` | consultation | Doctor's notes |
| `insurance_document` | administrative | Insurance cards, claims |
| `vaccination_record` | immunization | Vaccine certificates |
| `surgical_report` | surgical | Operation reports |
| `pathology_report` | laboratory | Biopsy results |
| `ecg` | diagnostic | ECG/EKG reports |
| `ultrasound` | imaging | Ultrasound scans |
| `medical_history` | history | Medical history documents |
| `consent_form` | administrative | Patient consent forms |
| `referral_letter` | administrative | Referral documents |
| `progress_note` | consultation | Follow-up notes |
| `other` | general | Other documents |

---

## Supported File Types

✅ **Images:** JPEG, JPG, PNG, GIF, WebP
✅ **Documents:** PDF, Word (.doc, .docx)
✅ **Spreadsheets:** Excel (.xls, .xlsx)
✅ **Medical:** DICOM files
✅ **Text:** Plain text files (.txt)

**Max File Size:** 50 MB

---

## Method 2: Manual Document Entry (Without File Upload)

**Endpoint:** `POST http://localhost:5001/api/medical-documents`

**Body Type:** raw (JSON)

```json
{
  "patient_id": "60d5f9e5f1b2c72b8c8e4f1a",
  "uploaded_by": "doctor_123",
  "file_name": "external-report.pdf",
  "file_url": "https://example.com/reports/file.pdf",
  "cloudinary_public_id": "manual_upload_123",
  "file_size": 123456,
  "file_type": "application/pdf",
  "document_type": "lab_report",
  "description": "External lab report",
  "tags": ["blood", "cholesterol"]
}
```

---

## Other Useful Endpoints

### Get All Documents
```
GET http://localhost:5001/api/medical-documents
```

### Get Documents by Patient
```
GET http://localhost:5001/api/medical-documents/patient/60d5f9e5f1b2c72b8c8e4f1a
```

### Get Single Document
```
GET http://localhost:5001/api/medical-documents/{document_id}
```

### Delete Document
```
DELETE http://localhost:5001/api/medical-documents/{document_id}
```

---

## Verifying Upload on Cloudinary

1. Go to [Cloudinary Dashboard](https://cloudinary.com/console)
2. Login with your credentials
3. Navigate to **Media Library**
4. Look for folder: **medical_documents**
5. You should see your uploaded files there!

---

## Common Errors

### Error: "File type not supported"
- **Cause:** Trying to upload unsupported file type
- **Solution:** Use only supported file types (PDF, images, Word, Excel, DICOM)

### Error: "File too large"
- **Cause:** File exceeds 50MB limit
- **Solution:** Compress the file or split into smaller parts

### Error: "Failed to upload file to Cloudinary"
- **Cause:** Invalid Cloudinary credentials or network issue
- **Solution:** Check `.env` file for correct Cloudinary credentials

### Error: "Validation failed"
- **Cause:** Missing required fields
- **Solution:** Ensure `patient_id`, `uploaded_by`, and `file` are provided

---

## Quick Test Checklist

- [ ] Backend server running on port 5001
- [ ] Cloudinary credentials in `.env` file
- [ ] Postman installed and open
- [ ] Test file ready (PDF, image, etc.)
- [ ] POST request to `/api/medical-documents/upload`
- [ ] Body type set to **form-data**
- [ ] File field type changed to **File** (not Text)
- [ ] Required fields filled: `file`, `patient_id`, `uploaded_by`
- [ ] Click "Send"
- [ ] Check response for Cloudinary URL
- [ ] Verify file in Cloudinary dashboard

---

## Need Help?

Check the backend console logs for detailed error messages:
```bash
# In backend terminal
npm run dev
```

Any errors will be displayed in the console output.
