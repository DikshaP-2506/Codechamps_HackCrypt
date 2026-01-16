const PatientProfile = require('../models/PatientProfile');
const mongoose = require('mongoose');

// @desc    Get all users with role='patient'
// @route   GET /api/patients/users/all
// @access  Public
exports.getPatientUsers = async (req, res, next) => {
  try {
    const { search } = req.query;

    const usersCollection = mongoose.connection.collection('users');
    const query = { role: 'patient' };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await usersCollection.find(query).toArray();

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all patient profiles from patients collection
// @route   GET /api/patients/profiles/all
// @access  Public
exports.getPatientProfiles = async (req, res, next) => {
  try {
    const { search } = req.query;

    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { emergency_contact_phone: { $regex: search, $options: 'i' } }
      ];
    }

    const patients = await PatientProfile.find(query).select('-__v').lean();

    res.status(200).json({
      success: true,
      count: patients.length,
      data: patients
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single patient profile by ID
// @route   GET /api/patients/:id
// @access  Public
exports.getPatientById = async (req, res, next) => {
  try {
    // Try to find by MongoDB _id first, then by clerk_user_id
    let patient = await PatientProfile.findById(req.params.id).select('-__v').catch(() => null);
    
    if (!patient) {
      // If not found by _id, try clerk_user_id
      patient = await PatientProfile.findOne({ clerk_user_id: req.params.id }).select('-__v');
    }

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient profile not found'
      });
    }

    res.status(200).json({
      success: true,
      data: patient
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new patient profile
// @route   POST /api/patients
// @access  Public
exports.createPatient = async (req, res, next) => {
  try {
    const patient = await PatientProfile.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Patient profile created successfully',
      data: patient
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update patient profile
// @route   PUT /api/patients/:id
// @access  Public
exports.updatePatient = async (req, res, next) => {
  try {
    let patient = await PatientProfile.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient profile not found'
      });
    }

    patient = await PatientProfile.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      message: 'Patient profile updated successfully',
      data: patient
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Auto-save patient profile (partial update)
// @route   PATCH /api/patients/:id/autosave
// @access  Public
exports.autoSavePatient = async (req, res, next) => {
  try {
    let patient = await PatientProfile.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient profile not found'
      });
    }

    patient = await PatientProfile.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      message: 'Auto-save successful',
      data: patient,
      timestamp: new Date()
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete patient profile
// @route   DELETE /api/patients/:id
// @access  Public
exports.deletePatient = async (req, res, next) => {
  try {
    const patient = await PatientProfile.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient profile not found'
      });
    }

    await patient.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Patient profile deleted successfully',
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get patient statistics
// @route   GET /api/patients/stats/overview
// @access  Public
exports.getPatientStats = async (req, res, next) => {
  try {
    const totalPatients = await PatientProfile.countDocuments();
    const activePatients = await PatientProfile.countDocuments({ is_active: true });
    const inactivePatients = totalPatients - activePatients;

    const recentPatients = await PatientProfile.find()
      .sort({ created_at: -1 })
      .limit(5)
      .select('name date_of_birth gender is_active created_at');

    // Get statistics by blood group
    const bloodGroupStats = await PatientProfile.aggregate([
      {
        $match: { blood_group: { $ne: '' } }
      },
      {
        $group: {
          _id: '$blood_group',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalPatients,
        activePatients,
        inactivePatients,
        bloodGroupStats,
        recentPatients
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add allergy to patient
// @route   POST /api/patients/:id/allergies
// @access  Public
exports.addAllergy = async (req, res, next) => {
  try {
    const patient = await PatientProfile.findById(req.params.id);

    const { allergy } = req.body;
    patient.allergies.push(allergy);
    await patient.save();

    res.status(201).json({
      success: true,
      message: 'Allergy added successfully',
      data: patient
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add chronic condition to patient
// @route   POST /api/patients/:id/chronic-conditions
// @access  Public
exports.addChronicCondition = async (req, res, next) => {
  try {
    const patient = await PatientProfile.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient profile not found'
      });
    }

    const { condition } = req.body;
    patient.chronic_conditions.push(condition);
    await patient.save();

    res.status(201).json({
      success: true,
      message: 'Chronic condition added successfully',
      data: patient
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add surgery to patient
// @route   POST /api/patients/:id/surgeries
// @access  Public
exports.addSurgery = async (req, res, next) => {
  try {
    const patient = await PatientProfile.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient profile not found'
      });
    }

    const { surgery } = req.body;
    patient.past_surgeries.push(surgery);
    await patient.save();

    res.status(201).json({
      success: true,
      message: 'Surgery record added successfully',
      data: patient
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update family history
// @route   PUT /api/patients/:id/family-history
// @access  Public
exports.updateFamilyHistory = async (req, res, next) => {
  try {
    const patient = await PatientProfile.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient profile not found',
      });
    }

    const { family_history } = req.body;

    patient.family_history = family_history;
    await patient.save();

    res.status(200).json({
      success: true,
      message: 'Family history updated successfully',
      data: patient,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get patients by doctor ID
// @route   GET /api/patients/doctor/:doctorId
// @access  Doctor
exports.getPatientsByDoctor = async (req, res, next) => {
  try {
    const { doctorId } = req.params;
    const { limit = 100 } = req.query;

    const patients = await PatientProfile.find({
      primary_doctor_id: doctorId,
      is_active: true
    })
      .sort({ created_at: -1 })
      .limit(parseInt(limit))
      .select('-__v');

    res.status(200).json({
      success: true,
      count: patients.length,
      data: patients
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get comprehensive patient data (vitals, mental health, documents, prescriptions)
// @route   GET /api/patients/:patientId/comprehensive
// @access  Doctor
exports.getComprehensivePatientData = async (req, res, next) => {
  try {
    const { patientId } = req.params;
    const PatientProfile = require('../models/PatientProfile');
    const PhysicalVitals = require('../models/PhysicalVitals');
    const MentalHealthLog = require('../models/MentalHealthLog');
    const MedicalDocument = require('../models/MedicalDocument');
    const Prescription = require('../models/Prescription');

    // Get patient profile
    const patient = await PatientProfile.findOne({
      $or: [
        { _id: patientId },
        { clerk_user_id: patientId }
      ]
    }).select('-__v');

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    const patientIdentifier = patient.clerk_user_id || patient._id.toString();

    // Get recent vitals (last 10)
    const vitals = await PhysicalVitals.find({
      patient_id: patientIdentifier
    })
      .sort({ recorded_at: -1 })
      .limit(10)
      .select('-__v');

    // Get mental health logs (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const mentalHealthLogs = await MentalHealthLog.find({
      patient_id: patientIdentifier,
      recorded_date: { $gte: thirtyDaysAgo }
    })
      .sort({ recorded_date: -1 })
      .select('-__v');

    // Get medical documents
    const documents = await MedicalDocument.find({
      patient_id: patientIdentifier,
      is_deleted: false,
      is_active: true
    })
      .sort({ uploaded_at: -1 })
      .limit(20)
      .select('-access_logs -__v');

    // Get prescriptions
    const prescriptions = await Prescription.find({
      patient_id: patientIdentifier
    })
      .sort({ prescribed_at: -1 })
      .limit(10)
      .select('-__v');

    // Calculate statistics
    const stats = {
      totalVitals: vitals.length,
      totalMentalHealthLogs: mentalHealthLogs.length,
      totalDocuments: documents.length,
      totalPrescriptions: prescriptions.length,
      latestVitals: vitals[0] || null,
      latestMentalHealth: mentalHealthLogs[0] || null
    };

    res.status(200).json({
      success: true,
      data: {
        patient,
        vitals,
        mentalHealthLogs,
        documents,
        prescriptions,
        statistics: stats
      }
    });
  } catch (error) {
    console.error('Get comprehensive patient data error:', error);
    next(error);
  }
};

