const express = require('express');
const router = express.Router();
const {
  deleteUserByEmail,
  createProfile,
  getAllDoctors,
  getUsersByRole
} = require('../controllers/userController');

// Delete user profile by email
router.delete('/delete/:email', deleteUserByEmail);

// Create user profile
router.post('/create-profile', createProfile);

// Get all doctors
router.get('/doctors', getAllDoctors);

// Get users by role
router.get('/by-role/:role', getUsersByRole);

module.exports = router;
