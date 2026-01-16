const Appointment = require('../models/Appointment');

// @desc    Get all appointments
// @route   GET /api/appointments
// @access  Public
exports.getAllAppointments = async (req, res, next) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      patient_id, 
      doctor_id, 
      status,
      appointment_type,
      start_date,
      end_date,
      sortBy = 'start_time', 
      order = 'asc' 
    } = req.query;

    const query = {};

    // Filter by patient_id if provided
    if (patient_id) {
      query.patient_id = patient_id;
    }

    // Filter by doctor_id if provided
    if (doctor_id) {
      query.doctor_id = doctor_id;
    }

    // Filter by status if provided
    if (status) {
      query.status = status;
    }

    // Filter by appointment_type if provided
    if (appointment_type) {
      query.appointment_type = appointment_type;
    }

    // Filter by date range
    if (start_date || end_date) {
      query.start_time = {};
      if (start_date) query.start_time.$gte = new Date(start_date);
      if (end_date) query.start_time.$lte = new Date(end_date);
    }

    const appointments = await Appointment.find(query)
      .sort({ [sortBy]: order === 'desc' ? -1 : 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-__v');

    const count = await Appointment.countDocuments(query);

    res.status(200).json({
      success: true,
      count: appointments.length,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      totalRecords: count,
      data: appointments
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get appointments by patient ID
// @route   GET /api/appointments/patient/:patientId
// @access  Public
exports.getAppointmentsByPatientId = async (req, res, next) => {
  try {
    const { limit = 10, status, upcoming } = req.query;

    const query = { patient_id: req.params.patientId };

    // Filter by status if provided
    if (status) {
      query.status = status;
    }

    // Filter upcoming appointments
    if (upcoming === 'true') {
      query.start_time = { $gte: new Date() };
    }

    const appointments = await Appointment.find(query)
      .sort({ start_time: 1 })
      .limit(limit * 1)
      .select('-__v');

    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get appointments by doctor ID
// @route   GET /api/appointments/doctor/:doctorId
// @access  Public
exports.getAppointmentsByDoctorId = async (req, res, next) => {
  try {
    const { limit = 10, status, date } = req.query;

    const query = { doctor_id: req.params.doctorId };

    // Filter by status if provided
    if (status) {
      query.status = status;
    }

    // Filter by specific date
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      query.start_time = { $gte: startOfDay, $lte: endOfDay };
    }

    const appointments = await Appointment.find(query)
      .sort({ start_time: 1 })
      .limit(limit * 1)
      .select('-__v');

    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single appointment by ID
// @route   GET /api/appointments/:id
// @access  Public
exports.getAppointmentById = async (req, res, next) => {
  try {
    // Try to find by MongoDB _id, handle invalid ObjectIds gracefully
    const appointment = await Appointment.findById(req.params.id).select('-__v').catch(() => null);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    res.status(200).json({
      success: true,
      data: appointment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new appointment
// @route   POST /api/appointments
// @access  Public
exports.createAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Appointment created successfully',
      data: appointment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update appointment
// @route   PUT /api/appointments/:id
// @access  Public
exports.updateAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).select('-__v');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Appointment updated successfully',
      data: appointment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete appointment
// @route   DELETE /api/appointments/:id
// @access  Public
exports.deleteAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Appointment deleted successfully',
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel appointment
// @route   PATCH /api/appointments/:id/cancel
// @access  Public
exports.cancelAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: 'cancelled' },
      {
        new: true,
        runValidators: true
      }
    ).select('-__v');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Appointment cancelled successfully',
      data: appointment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Confirm appointment
// @route   PATCH /api/appointments/:id/confirm
// @access  Public
exports.confirmAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: 'confirmed' },
      {
        new: true,
        runValidators: true
      }
    ).select('-__v');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Appointment confirmed successfully',
      data: appointment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Complete appointment
// @route   PATCH /api/appointments/:id/complete
// @access  Public
exports.completeAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: 'completed' },
      {
        new: true,
        runValidators: true
      }
    ).select('-__v');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Appointment marked as completed',
      data: appointment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get upcoming appointments for reminders
// @route   GET /api/appointments/reminders/pending
// @access  Public
exports.getPendingReminders = async (req, res, next) => {
  try {
    const now = new Date();
    const twentyFourHoursLater = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

    // Find appointments that need 24-hour reminders
    const reminders24h = await Appointment.find({
      start_time: { $gte: now, $lte: twentyFourHoursLater },
      reminder_sent_24h: false,
      status: { $in: ['scheduled', 'confirmed'] }
    }).select('-__v');

    // Find appointments that need 1-hour reminders
    const reminders1h = await Appointment.find({
      start_time: { $gte: now, $lte: oneHourLater },
      reminder_sent_1h: false,
      status: { $in: ['scheduled', 'confirmed'] }
    }).select('-__v');

    res.status(200).json({
      success: true,
      data: {
        reminders_24h: reminders24h,
        reminders_1h: reminders1h
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark reminder as sent
// @route   PATCH /api/appointments/:id/reminder
// @access  Public
exports.markReminderSent = async (req, res, next) => {
  try {
    const { reminder_type } = req.body; // '24h' or '1h'

    const updateField = reminder_type === '24h' ? 'reminder_sent_24h' : 'reminder_sent_1h';

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { [updateField]: true },
      {
        new: true,
        runValidators: true
      }
    ).select('-__v');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    res.status(200).json({
      success: true,
      message: `${reminder_type} reminder marked as sent`,
      data: appointment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get appointment statistics
// @route   GET /api/appointments/stats/overview
// @access  Public
exports.getAppointmentStats = async (req, res, next) => {
  try {
    const { patient_id, doctor_id, start_date, end_date } = req.query;

    const matchStage = {};
    if (patient_id) matchStage.patient_id = patient_id;
    if (doctor_id) matchStage.doctor_id = doctor_id;
    
    if (start_date || end_date) {
      matchStage.start_time = {};
      if (start_date) matchStage.start_time.$gte = new Date(start_date);
      if (end_date) matchStage.start_time.$lte = new Date(end_date);
    }

    const stats = await Appointment.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalAppointments: { $sum: 1 },
          scheduled: {
            $sum: { $cond: [{ $eq: ['$status', 'scheduled'] }, 1, 0] }
          },
          confirmed: {
            $sum: { $cond: [{ $eq: ['$status', 'confirmed'] }, 1, 0] }
          },
          completed: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          },
          cancelled: {
            $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] }
          },
          noShow: {
            $sum: { $cond: [{ $eq: ['$status', 'no-show'] }, 1, 0] }
          },
          avgDuration: { $avg: '$duration_minutes' }
        }
      }
    ]);

    // Get appointment type distribution
    const typeDistribution = await Appointment.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$appointment_type',
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        overview: stats[0] || {
          totalAppointments: 0,
          scheduled: 0,
          confirmed: 0,
          completed: 0,
          cancelled: 0,
          noShow: 0,
          avgDuration: 0
        },
        typeDistribution: typeDistribution.map(type => ({
          type: type._id,
          count: type.count
        }))
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Check doctor availability
// @route   GET /api/appointments/availability/:doctorId
// @access  Public
exports.checkDoctorAvailability = async (req, res, next) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: 'Date is required'
      });
    }

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const appointments = await Appointment.find({
      doctor_id: req.params.doctorId,
      start_time: { $gte: startOfDay, $lte: endOfDay },
      status: { $nin: ['cancelled', 'no-show'] }
    })
      .sort({ start_time: 1 })
      .select('start_time duration_minutes');

    // Calculate busy time slots
    const busySlots = appointments.map(apt => ({
      start: apt.start_time,
      end: apt.end_time
    }));

    res.status(200).json({
      success: true,
      data: {
        date: date,
        doctor_id: req.params.doctorId,
        busySlots: busySlots,
        totalAppointments: appointments.length
      }
    });
  } catch (error) {
    next(error);
  }
};
