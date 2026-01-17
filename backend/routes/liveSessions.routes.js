const express = require('express');
const router = express.Router();

const {
  createLiveSession,
  getDoctorSessions,
  getPatientSessions,
} = require('../controllers/liveSessions.controller.js');

// Doctor creates teleconsultation session
router.post('/', createLiveSession);

// Doctor views their teleconsultation sessions
router.get('/doctor', getDoctorSessions);

// Patient views available teleconsultation sessions
router.get('/patient', getPatientSessions);

module.exports = router;
