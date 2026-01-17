const express = require('express');
const router = express.Router();
const {
  getAllAppointments,
  getAppointmentsByPatientId,
  getAppointmentsByDoctorId,
  getAppointmentById,
  createAppointment,
  requestAppointment,
  getRequestedAppointmentsForDoctor,
  approveAppointment,
  rejectAppointment,
  updateAppointment,
  deleteAppointment,
  cancelAppointment,
  confirmAppointment,
  completeAppointment,
  getPendingReminders,
  markReminderSent,
  getAppointmentStats,
  checkDoctorAvailability
} = require('../controllers/appointmentController');
const { validateAppointment } = require('../middleware/validators');

// Statistics and reminder routes (must be before /:id)
router.get('/stats/overview', getAppointmentStats);
router.get('/reminders/pending', getPendingReminders);
router.get('/availability/:doctorId', checkDoctorAvailability);

// Main routes
router.route('/')
  .get(getAllAppointments)
  .post(validateAppointment, createAppointment);

// Request appointment (patient-initiated)
router.post('/request', requestAppointment);

// Doctor approval/rejection routes
router.get('/doctor/:doctorId/requested', getRequestedAppointmentsForDoctor);
router.patch('/:id/approve', approveAppointment);
router.patch('/:id/reject', rejectAppointment);

router.route('/:id')
  .get(getAppointmentById)
  .put(validateAppointment, updateAppointment)
  .delete(deleteAppointment);

// Status update routes
router.patch('/:id/cancel', cancelAppointment);
router.patch('/:id/confirm', confirmAppointment);
router.patch('/:id/complete', completeAppointment);
router.patch('/:id/reminder', markReminderSent);

// Patient-specific routes
router.get('/patient/:patientId', getAppointmentsByPatientId);

// Doctor-specific routes
router.get('/doctor/:doctorId', getAppointmentsByDoctorId);

module.exports = router;
