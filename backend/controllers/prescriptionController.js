const Prescription = require('../models/Prescription');

// @desc    Get all prescriptions
// @route   GET /api/prescriptions
// @access  Public
exports.getAllPrescriptions = async (req, res, next) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      patient_id, 
      doctor_id, 
      is_active,
      sortBy = 'created_at', 
      order = 'desc' 
    } = req.query;

    const query = {};

    // Filter by patient_id if provided
    if (patient_id) {
      query.patient_id = parseInt(patient_id);
    }

    // Filter by doctor_id if provided
    if (doctor_id) {
      query.doctor_id = parseInt(doctor_id);
    }

    // Filter by is_active if provided
    if (is_active !== undefined) {
      query.is_active = is_active === 'true';
    }

    const prescriptions = await Prescription.find(query)
      .populate('patient_id', 'name date_of_birth gender')
      .populate('doctor_id', 'name specialization')
      .sort({ [sortBy]: order === 'desc' ? -1 : 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-__v');

    const count = await Prescription.countDocuments(query);

    res.status(200).json({
      success: true,
      count: prescriptions.length,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      totalRecords: count,
      data: prescriptions
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get prescriptions by patient ID
// @route   GET /api/prescriptions/patient/:patientId
// @access  Public
exports.getPrescriptionsByPatientId = async (req, res, next) => {
  try {
    const { limit = 10, sortBy = 'created_at', order = 'desc', is_active } = req.query;

    const query = { patient_id: parseInt(req.params.patientId) };

    // Filter by is_active if provided
    if (is_active !== undefined) {
      query.is_active = is_active === 'true';
    }

    const prescriptions = await Prescription.find(query)
      .populate('doctor_id', 'name specialization')
      .sort({ [sortBy]: order === 'desc' ? -1 : 1 })
      .limit(limit * 1)
      .select('-__v');

    res.status(200).json({
      success: true,
      count: prescriptions.length,
      data: prescriptions
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get prescriptions by doctor ID
// @route   GET /api/prescriptions/doctor/:doctorId
// @access  Public
exports.getPrescriptionsByDoctorId = async (req, res, next) => {
  try {
    const { limit = 10, sortBy = 'created_at', order = 'desc', is_active } = req.query;

    const query = { doctor_id: parseInt(req.params.doctorId) };

    // Filter by is_active if provided
    if (is_active !== undefined) {
      query.is_active = is_active === 'true';
    }

    const prescriptions = await Prescription.find(query)
      .populate('patient_id', 'name date_of_birth gender')
      .sort({ [sortBy]: order === 'desc' ? -1 : 1 })
      .limit(limit * 1)
      .select('-__v');

    res.status(200).json({
      success: true,
      count: prescriptions.length,
      data: prescriptions
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single prescription by ID
// @route   GET /api/prescriptions/:id
// @access  Public
exports.getPrescriptionById = async (req, res, next) => {
  try {
    const prescription = await Prescription.findById(req.params.id)
      .populate('patient_id', 'name date_of_birth gender blood_group emergency_contact_phone')
      .populate('doctor_id', 'name specialization contact_number')
      .select('-__v').catch(() => null);

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: 'Prescription not found'
      });
    }

    res.status(200).json({
      success: true,
      data: prescription
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new prescription
// @route   POST /api/prescriptions
// @access  Public
exports.createPrescription = async (req, res, next) => {
  try {
    const prescription = await Prescription.create(req.body);

    // Populate after creation
    await prescription.populate('patient_id', 'name date_of_birth gender');
    await prescription.populate('doctor_id', 'name specialization');

    res.status(201).json({
      success: true,
      message: 'Prescription created successfully',
      data: prescription
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update prescription
// @route   PUT /api/prescriptions/:id
// @access  Public
exports.updatePrescription = async (req, res, next) => {
  try {
    const prescription = await Prescription.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    )
      .populate('patient_id', 'name date_of_birth gender')
      .populate('doctor_id', 'name specialization')
      .select('-__v');

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: 'Prescription not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Prescription updated successfully',
      data: prescription
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete prescription
// @route   DELETE /api/prescriptions/:id
// @access  Public
exports.deletePrescription = async (req, res, next) => {
  try {
    const prescription = await Prescription.findByIdAndDelete(req.params.id);

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: 'Prescription not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Prescription deleted successfully',
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark prescription as completed
// @route   PATCH /api/prescriptions/:id/complete
// @access  Public
exports.completePrescription = async (req, res, next) => {
  try {
    const prescription = await Prescription.findByIdAndUpdate(
      req.params.id,
      {
        is_active: false,
        completed_at: new Date()
      },
      {
        new: true,
        runValidators: true
      }
    )
      .populate('patient_id', 'name date_of_birth gender')
      .populate('doctor_id', 'name specialization')
      .select('-__v');

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: 'Prescription not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Prescription marked as completed',
      data: prescription
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get active prescriptions for a patient
// @route   GET /api/prescriptions/patient/:patientId/active
// @access  Public
exports.getActivePrescriptionsByPatient = async (req, res, next) => {
  try {
    const prescriptions = await Prescription.find({
      patient_id: parseInt(req.params.patientId),
      is_active: true
    })
      .populate('doctor_id', 'name specialization')
      .sort({ created_at: -1 })
      .select('-__v');

    res.status(200).json({
      success: true,
      count: prescriptions.length,
      data: prescriptions
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get prescription statistics
// @route   GET /api/prescriptions/stats/overview
// @access  Public
exports.getPrescriptionStats = async (req, res, next) => {
  try {
    const { patient_id, doctor_id } = req.query;

    const matchStage = {};
    if (patient_id) matchStage.patient_id = parseInt(patient_id);
    if (doctor_id) matchStage.doctor_id = parseInt(doctor_id);

    const stats = await Prescription.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalPrescriptions: { $sum: 1 },
          activePrescriptions: {
            $sum: { $cond: [{ $eq: ['$is_active', true] }, 1, 0] }
          },
          completedPrescriptions: {
            $sum: { $cond: [{ $eq: ['$is_active', false] }, 1, 0] }
          },
          avgDuration: { $avg: '$duration_days' }
        }
      }
    ]);

    // Get most prescribed medications
    const topMedications = await Prescription.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$medication_name',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    res.status(200).json({
      success: true,
      data: {
        overview: stats[0] || {
          totalPrescriptions: 0,
          activePrescriptions: 0,
          completedPrescriptions: 0,
          avgDuration: 0
        },
        topMedications: topMedications.map(med => ({
          medication: med._id,
          prescriptionCount: med.count
        }))
      }
    });
  } catch (error) {
    next(error);
  }
};
