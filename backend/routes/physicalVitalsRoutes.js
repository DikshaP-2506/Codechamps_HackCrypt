const express = require('express');
const router = express.Router();
const {
  getAllVitals,
  getVitalsByPatientId,
  getVitalById,
  createVital,
  updateVital,
  deleteVital,
  getLatestVitals,
  getVitalsStats
} = require('../controllers/physicalVitalsController');
const { validateVital } = require('../middleware/validators');

// Main routes
router.route('/')
  .get(getAllVitals)
  .post(validateVital, createVital);

router.route('/:id')
  .get(getVitalById)
  .put(validateVital, updateVital)
  .delete(deleteVital);

// Patient-specific routes
router.get('/patient/:patientId', getVitalsByPatientId);
router.get('/patient/:patientId/latest', getLatestVitals);
router.get('/patient/:patientId/stats', getVitalsStats);

module.exports = router;
