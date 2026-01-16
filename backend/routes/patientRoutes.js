const express = require('express');
const router = express.Router();
const {
  getAllPatients,
  getPatientById,
  createPatient,
  updatePatient,
  autoSavePatient,
  deletePatient,
  getPatientStats,
  addAllergy,
  addChronicCondition,
  addSurgery,
  updateFamilyHistory,
  getPatientsByDoctor,
  getComprehensivePatientData
} = require('../controllers/patientController');
const { validatePatient, validateAutoSave } = require('../middleware/validators');

// Statistics route (must be before /:id route)
router.get('/stats/overview', getPatientStats);

// Doctor-specific routes (must be before /:id route)
router.get('/doctor/:doctorId', getPatientsByDoctor);
router.get('/:patientId/comprehensive', getComprehensivePatientData);

// Main patient routes
router.route('/')
  .get(getAllPatients)
  .post(validatePatient, createPatient);

router.route('/:id')
  .get(getPatientById)
  .put(validatePatient, updatePatient)
  .delete(deletePatient);

// Auto-save route
router.patch('/:id/autosave', validateAutoSave, autoSavePatient);

// Sub-document routes
router.post('/:id/allergies', addAllergy);
router.post('/:id/chronic-conditions', addChronicCondition);
router.post('/:id/surgeries', addSurgery);
router.put('/:id/family-history', updateFamilyHistory); // Changed to PUT for string field

module.exports = router;
