const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
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
  logDownload,
  getLabReporterStats
} = require('../controllers/medicalDocumentController');

// Statistics routes (must be before /:id)
router.get('/stats/overview', getDocumentStats);
router.get('/stats/lab-reporter', getLabReporterStats);

// File upload route (with multer middleware)
router.post('/upload', upload.single('file'), createDocument);

// Main routes
router.route('/')
  .get(getAllDocuments)
  .post(createDocument);

router.route('/:id')
  .get(getDocumentById)
  .put(updateDocument)
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
