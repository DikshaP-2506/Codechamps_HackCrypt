const mongoose = require('mongoose');

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
