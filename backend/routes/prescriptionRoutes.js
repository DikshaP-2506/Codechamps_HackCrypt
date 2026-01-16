const express = require('express');
const router = express.Router();
const {
  getAllPrescriptions,
  getPrescriptionsByPatientId,
  getPrescriptionsByDoctorId,
  getPrescriptionById,
  createPrescription,
  updatePrescription,
  deletePrescription,
  completePrescription,
  getActivePrescriptionsByPatient,
  getPrescriptionStats
} = require('../controllers/prescriptionController');
const { validatePrescription } = require('../middleware/validators');

// Statistics route (must be before /:id)
router.get('/stats/overview', getPrescriptionStats);

// Main routes
router.route('/')
  .get(getAllPrescriptions)
  .post(validatePrescription, createPrescription);

router.route('/:id')
  .get(getPrescriptionById)
  .put(validatePrescription, updatePrescription)
  .delete(deletePrescription);

// Complete prescription
router.patch('/:id/complete', completePrescription);

// Patient-specific routes
router.get('/patient/:patientId', getPrescriptionsByPatientId);
router.get('/patient/:patientId/active', getActivePrescriptionsByPatient);

// Doctor-specific routes
router.get('/doctor/:doctorId', getPrescriptionsByDoctorId);

module.exports = router;
