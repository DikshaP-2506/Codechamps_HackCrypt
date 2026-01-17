const PhysicalVitals = require('../models/PhysicalVitals');

// @desc    Get all physical vitals records
// @route   GET /api/physical-vitals
// @access  Public
exports.getAllVitals = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, patient_id, sortBy = 'recorded_at', order = 'desc' } = req.query;

    const query = {};

    // Filter by patient_id if provided
    if (patient_id) {
      query.patient_id = patient_id;
    }

    const vitals = await PhysicalVitals.find(query)
      .populate('patient_id', 'name date_of_birth gender')
      .populate('recorded_by', 'name email')
      .sort({ [sortBy]: order === 'desc' ? -1 : 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-__v');

    const count = await PhysicalVitals.countDocuments(query);

    res.status(200).json({
      success: true,
      count: vitals.length,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      totalRecords: count,
      data: vitals
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get physical vitals by patient ID
// @route   GET /api/physical-vitals/patient/:patientId
// @access  Public
exports.getVitalsByPatientId = async (req, res, next) => {
  try {
    const { limit = 10, sortBy = 'recorded_at', order = 'desc' } = req.query;

    // Try to find vitals by patient_id (could be _id or clerk_user_id)
    let vitals = await PhysicalVitals.find({ patient_id: req.params.patientId })
      .populate('recorded_by', 'name email')
      .sort({ [sortBy]: order === 'desc' ? -1 : 1 })
      .limit(limit * 1)
      .select('-__v')
      .lean();

    // If no vitals found and patientId looks like MongoDB ObjectId, 
    // also try searching by clerk_user_id from patient profile
    if (vitals.length === 0 && mongoose.Types.ObjectId.isValid(req.params.patientId)) {
      const PatientProfile = require('../models/PatientProfile');
      const patient = await PatientProfile.findById(req.params.patientId).select('clerk_user_id');
      
      if (patient && patient.clerk_user_id) {
        vitals = await PhysicalVitals.find({ patient_id: patient.clerk_user_id })
          .populate('recorded_by', 'name email')
          .sort({ [sortBy]: order === 'desc' ? -1 : 1 })
          .limit(limit * 1)
          .select('-__v')
          .lean();
      }
    }

    res.status(200).json({
      success: true,
      count: vitals.length,
      data: vitals
    });
  } catch (error) {
    console.error('Get vitals by patient ID error:', error);
    next(error);
  }
};

// @desc    Get single physical vital record by ID
// @route   GET /api/physical-vitals/:id
// @access  Public
exports.getVitalById = async (req, res, next) => {
  try {
    const vital = await PhysicalVitals.findById(req.params.id)
      .populate('patient_id', 'name date_of_birth gender blood_group')
      .populate('recorded_by', 'name email')
      .select('-__v');

    if (!vital) {
      return res.status(404).json({
        success: false,
        message: 'Physical vital record not found'
      });
    }

    res.status(200).json({
      success: true,
      data: vital
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new physical vital record
// @route   POST /api/physical-vitals
// @access  Public
exports.createVital = async (req, res, next) => {
  try {
    const vital = await PhysicalVitals.create(req.body);

    // Populate after creation
    await vital.populate('patient_id', 'name date_of_birth gender');

    res.status(201).json({
      success: true,
      message: 'Physical vital record created successfully',
      data: vital
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update physical vital record
// @route   PUT /api/physical-vitals/:id
// @access  Public
exports.updateVital = async (req, res, next) => {
  try {
    let vital = await PhysicalVitals.findById(req.params.id);

    if (!vital) {
      return res.status(404).json({
        success: false,
        message: 'Physical vital record not found'
      });
    }

    vital = await PhysicalVitals.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate('patient_id', 'name date_of_birth gender');

    res.status(200).json({
      success: true,
      message: 'Physical vital record updated successfully',
      data: vital
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete physical vital record
// @route   DELETE /api/physical-vitals/:id
// @access  Public
exports.deleteVital = async (req, res, next) => {
  try {
    const vital = await PhysicalVitals.findById(req.params.id);

    if (!vital) {
      return res.status(404).json({
        success: false,
        message: 'Physical vital record not found'
      });
    }

    await vital.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Physical vital record deleted successfully',
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get latest vitals for a patient
// @route   GET /api/physical-vitals/patient/:patientId/latest
// @access  Public
exports.getLatestVitals = async (req, res, next) => {
  try {
    const vital = await PhysicalVitals.findOne({ patient_id: req.params.patientId })
      .sort({ recorded_at: -1 })
      .populate('patient_id', 'name date_of_birth gender blood_group')
      .populate('recorded_by', 'name email')
      .select('-__v');

    if (!vital) {
      return res.status(404).json({
        success: false,
        message: 'No vital records found for this patient'
      });
    }

    res.status(200).json({
      success: true,
      data: vital
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get vitals statistics for a patient
// @route   GET /api/physical-vitals/patient/:patientId/stats
// @access  Public
exports.getVitalsStats = async (req, res, next) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const stats = await PhysicalVitals.aggregate([
      {
        $match: {
          patient_id: req.params.patientId,
          recorded_at: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: null,
          avgSystolicBP: { $avg: '$systolic_bp' },
          avgDiastolicBP: { $avg: '$diastolic_bp' },
          avgHeartRate: { $avg: '$heart_rate' },
          avgBloodSugar: { $avg: '$blood_sugar' },
          avgTemperature: { $avg: '$temperature' },
          avgSpO2: { $avg: '$spo2' },
          avgWeight: { $avg: '$weight' },
          avgBMI: { $avg: '$bmi' },
          totalRecords: { $sum: 1 },
          latestRecording: { $max: '$recorded_at' }
        }
      }
    ]);

    const recentVitals = await PhysicalVitals.find({ 
      patient_id: req.params.patientId,
      recorded_at: { $gte: startDate }
    })
      .sort({ recorded_at: -1 })
      .limit(10)
      .select('systolic_bp diastolic_bp heart_rate blood_sugar temperature spo2 recorded_at');

    res.status(200).json({
      success: true,
      data: {
        period: `Last ${days} days`,
        statistics: stats[0] || {},
        recentReadings: recentVitals
      }
    });
  } catch (error) {
    next(error);
  }
};
