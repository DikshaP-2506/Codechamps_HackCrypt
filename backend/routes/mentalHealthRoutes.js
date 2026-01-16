const express = require('express');
const router = express.Router();
const mentalHealthController = require('../controllers/mentalHealthController');

// Patient Routes
// Quick mood logging (simplified for daily use)
router.post('/quick-log', mentalHealthController.quickMoodLog);

// Full mental health log entry
router.post('/', mentalHealthController.createMentalHealthLog);

// Get recent mood logs (last 7 days)
router.get('/recent/:patientId', mentalHealthController.getRecentMoodLogs);

// Doctor Routes
// Get all mental health logs for a specific patient
router.get('/patient/:patientId', mentalHealthController.getPatientMentalHealthLogs);

// Get analytics and statistics for a patient
router.get('/analytics/:patientId', mentalHealthController.getMentalHealthAnalytics);

// General Routes
// Get a single mental health log by ID
router.get('/:id', mentalHealthController.getMentalHealthLogById);

// Update a mental health log
router.put('/:id', mentalHealthController.updateMentalHealthLog);

// Delete a mental health log
router.delete('/:id', mentalHealthController.deleteMentalHealthLog);

module.exports = router;
