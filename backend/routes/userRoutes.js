const express = require('express');
const router = express.Router();
const {
  getAllDoctors,
  getUsersByRole
} = require('../controllers/userController');

// Get all doctors
router.get('/doctors', getAllDoctors);

// Get users by role
router.get('/by-role/:role', getUsersByRole);

module.exports = router;
