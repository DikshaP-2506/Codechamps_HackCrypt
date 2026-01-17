const mongoose = require('mongoose');

// @desc    Delete user profile by email
// @route   DELETE /api/users/delete/:email
// @access  Public
exports.deleteUserByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    const User = mongoose.connection.collection('users');
    const PatientProfile = mongoose.connection.collection('patients');
    
    // Delete from users collection
    const userResult = await User.deleteOne({ email });
    
    // Delete from patients collection
    const patientResult = await PatientProfile.deleteOne({ email });

    res.status(200).json({
      success: true,
      message: 'User profile deleted successfully',
      data: {
        userDeleted: userResult.deletedCount,
        patientDeleted: patientResult.deletedCount
      }
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting user',
      error: error.message
    });
  }
};

// @desc    Create user profile with admin auto-assignment
// @route   POST /api/users/create-profile
// @access  Public
exports.createProfile = async (req, res) => {
  try {
    const { phone, role, dateOfBirth, gender } = req.body;
    
    // Get user email from request context (should be passed from frontend)
    const userEmail = req.body.email;
    
    if (!phone || !role || !dateOfBirth || !gender || !userEmail) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: phone, role, dateOfBirth, gender, email'
      });
    }

    // Check if this email should be admin
    const adminEmail = process.env.ADMIN_EMAIL;
    let assignedRole = role;
    
    if (userEmail === adminEmail) {
      assignedRole = 'admin';
    }

    // Connect to users collection
    const User = mongoose.connection.collection('users');
    
    // Update user with profile data
    const result = await User.updateOne(
      { email: userEmail },
      {
        $set: {
          phone,
          role: assignedRole,
          dateOfBirth,
          gender,
          isProfileComplete: true,
          updatedAt: new Date()
        }
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profile created successfully',
      data: {
        role: assignedRole,
        isAdmin: assignedRole === 'admin'
      }
    });
  } catch (error) {
    console.error('Create profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating profile',
      error: error.message
    });
  }
};

// Since User model is in frontend (Next.js), we'll query directly
// @desc    Get all doctors
// @route   GET /api/users/doctors
// @access  Public
exports.getAllDoctors = async (req, res) => {
  try {
    // Connect to User collection from frontend
    const User = mongoose.connection.collection('users');
    
    const doctors = await User.find({ 
      role: 'doctor',
      isActive: true 
    }).toArray();

    // Format response
    const formattedDoctors = doctors.map(doctor => ({
      id: doctor._id.toString(),
      clerkId: doctor.clerkId,
      name: doctor.name || `${doctor.firstName || ''} ${doctor.lastName || ''}`.trim(),
      email: doctor.email,
      phone: doctor.phone,
      specialization: doctor.specialization || 'General Physician'
    }));

    res.status(200).json({
      success: true,
      count: formattedDoctors.length,
      data: formattedDoctors
    });
  } catch (error) {
    console.error('Get all doctors error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving doctors',
      error: error.message
    });
  }
};

// @desc    Get all users by role
// @route   GET /api/users/by-role/:role
// @access  Public
exports.getUsersByRole = async (req, res) => {
  try {
    const { role } = req.params;
    const validRoles = ['patient', 'doctor', 'admin', 'caretaker', 'lab_reporter', 'nurse'];
    
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: `Invalid role. Must be one of: ${validRoles.join(', ')}`
      });
    }

    const User = mongoose.connection.collection('users');
    
    const users = await User.find({ 
      role: role,
      isActive: true 
    }).toArray();

    const formattedUsers = users.map(user => ({
      id: user._id.toString(),
      clerkId: user.clerkId,
      name: user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim(),
      email: user.email,
      phone: user.phone,
      role: user.role
    }));

    res.status(200).json({
      success: true,
      count: formattedUsers.length,
      data: formattedUsers
    });
  } catch (error) {
    console.error(`Get users by role error:`, error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving users',
      error: error.message
    });
  }
};
