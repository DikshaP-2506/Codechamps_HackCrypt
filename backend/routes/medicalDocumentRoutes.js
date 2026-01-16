const express = require('express');
const router = express.Router();
const {
  getAllDocuments,
  getDocumentsByPatientId,
  getDocumentsByUploader,
  getDocumentById,
  createDocument,
  updateDocument,
  deleteDocument,
  shareDocument,
  revokeSharing,
  getAccessLogs,
  createNewVersion,
  getVersionHistory,
  getDocumentStats,
  logDownload
} = require('../controllers/medicalDocumentController');
const { validateMedicalDocument } = require('../middleware/validators');

// Statistics route (must be before /:id)
router.get('/stats/overview', getDocumentStats);

// Main routes
router.route('/')
  .get(getAllDocuments)
  .post(validateMedicalDocument, createDocument);

router.route('/:id')
  .get(getDocumentById)
  .put(validateMedicalDocument, updateDocument)
  .delete(deleteDocument);

// Patient-specific routes
router.get('/patient/:patientId', getDocumentsByPatientId);

// Uploader-specific routes
router.get('/uploaded-by/:userId', getDocumentsByUploader);

// Sharing routes
router.post('/:id/share', shareDocument);
router.delete('/:id/share/:userId', revokeSharing);

// Access logs
router.get('/:id/access-logs', getAccessLogs);

// Version control
router.post('/:id/version', createNewVersion);
router.get('/:id/versions', getVersionHistory);

// Download logging
router.post('/:id/download', logDownload);

module.exports = router;
