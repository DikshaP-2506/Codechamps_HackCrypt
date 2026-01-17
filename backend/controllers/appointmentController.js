const mongoose = require('mongoose');
const Appointment = require('../models/Appointment');
const User = require('../models/User');

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
    const { limit = 100, status, upcoming } = req.query;

    const query = { patient_id: req.params.patientId };

    console.log('=== FETCH PATIENT APPOINTMENTS ===');
    console.log('Patient ID:', req.params.patientId);
    console.log('Query:', query);

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

    console.log('Found appointments:', appointments.length);

    // We need to manually fetch doctor info from Users collection since doctor_id is just a Clerk ID string
    const User = require('mongoose').connection.collection('users');
    
    const appointmentsWithDoctors = await Promise.all(
      appointments.map(async (apt) => {
        const aptObj = apt.toObject();
        if (aptObj.doctor_id) {
          // Try to find doctor by clerkId
          const doctor = await User.findOne({ clerkId: aptObj.doctor_id });
          if (doctor) {
            aptObj.doctor_id = {
              _id: doctor._id.toString(),
              firstName: doctor.firstName || doctor.name?.split(' ')[0] || '',
              lastName: doctor.lastName || doctor.name?.split(' ')[1] || '',
              email: doctor.email,
              role: doctor.role
            };
          }
        }
        return aptObj;
      })
    );

    console.log('Appointments with doctor info:', appointmentsWithDoctors.length);

    res.status(200).json({
      success: true,
      count: appointmentsWithDoctors.length,
      data: appointmentsWithDoctors
    });
  } catch (error) {
    console.error('Error fetching patient appointments:', error);
    next(error);
  }
};

// @desc    Get appointments by doctor ID
// @route   GET /api/appointments/doctor/:doctorId
// @access  Public
exports.getAppointmentsByDoctorId = async (req, res, next) => {
  try {
    const { limit = 100, status, date } = req.query;

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
      .populate('patient_id', 'first_name last_name email phone_number')
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

// @desc    Request new appointment (Patient-initiated)
// @route   POST /api/appointments/request
// @access  Public
exports.requestAppointment = async (req, res, next) => {
  try {
    const { 
      patient_id, // Should come from authenticated session
      doctor_id, 
      appointment_type, 
      preferred_dates, 
      preferred_times, 
      reason 
    } = req.body;

    console.log('=== REQUEST APPOINTMENT ===');
    console.log('Patient ID:', patient_id);
    console.log('Doctor ID:', doctor_id);
    console.log('Appointment Type:', appointment_type);
    console.log('Preferred Dates:', preferred_dates);
    console.log('Preferred Times:', preferred_times);

    // Validation
    if (!doctor_id || !appointment_type) {
      return res.status(400).json({
        success: false,
        message: 'doctor_id and appointment_type are required'
      });
    }

    if (!patient_id) {
      return res.status(400).json({
        success: false,
        message: 'patient_id is required (should be extracted from session)'
      });
    }

    if (!preferred_dates || preferred_dates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one preferred date is required'
      });
    }

    if (preferred_dates.length > 3) {
      return res.status(400).json({
        success: false,
        message: 'Maximum of 3 preferred dates allowed'
      });
    }

    if (!preferred_times || preferred_times.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one preferred time must be selected'
      });
    }

    // Create appointment request with auto-generated fields
    const appointmentRequest = await Appointment.create({
      patient_id,
      doctor_id,
      appointment_type,
      preferred_dates,
      preferred_times,
      reason: reason || '',
      status: 'requested', // Auto-set
      location: null, // Auto-set
      reminder_sent_24h: false, // Auto-set
      reminder_sent_1h: false, // Auto-set
      is_recurring: false, // Auto-set
      recurrence_pattern: 'none' // Auto-set
    });

    res.status(201).json({
      success: true,
      message: 'Appointment request submitted successfully',
      data: appointmentRequest
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

// @desc    Get requested appointments for doctor
// @route   GET /api/appointments/doctor/:doctorId/requested
// @access  Public
exports.getRequestedAppointmentsForDoctor = async (req, res, next) => {
  try {
    const { doctorId } = req.params;
    
    console.log('=== FETCH REQUESTED APPOINTMENTS ===');
    console.log('Doctor ID from params:', doctorId);
    
    // First, check ALL requested appointments to see what doctor_ids exist
    const allRequested = await Appointment.find({ status: 'requested' })
      .select('doctor_id patient_id appointment_type created_at');
    
    console.log('ALL requested appointments in DB:', allRequested.length);
    allRequested.forEach((apt, index) => {
      console.log(`Appointment ${index + 1}: doctor_id = "${apt.doctor_id}", type: ${typeof apt.doctor_id}`);
    });
    
    // Try to find appointments with doctor_id matching either ObjectId or Clerk ID
    const appointments = await Appointment.find({
      doctor_id: doctorId,
      status: 'requested'
    })
      .sort({ created_at: -1 })
      .select('-__v')
      .lean();

    console.log('Found appointments matching doctor_id:', appointments.length);
    console.log('Search doctor_id:', doctorId);

    // Manually fetch patient information from Users collection using clerkId
    const appointmentsWithPatients = await Promise.all(
      appointments.map(async (appointment) => {
        if (appointment.patient_id) {
          const patientUser = await User.findOne(
            { clerkId: appointment.patient_id },
            'clerkId firstName lastName email photoUrl'
          );
          
          if (patientUser) {
            appointment.patient = {
              _id: patientUser._id,
              clerkId: patientUser.clerkId,
              firstName: patientUser.firstName,
              lastName: patientUser.lastName,
              email: patientUser.email,
              photoUrl: patientUser.photoUrl
            };
          }
        }
        return appointment;
      })
    );

    res.status(200).json({
      success: true,
      count: appointmentsWithPatients.length,
      data: appointmentsWithPatients
    });
  } catch (error) {
    console.error('Error fetching requested appointments:', error);
    next(error);
  }
};

// @desc    Approve appointment request
// @route   PATCH /api/appointments/:id/approve
// @access  Public
exports.approveAppointment = async (req, res, next) => {
  try {
    const { scheduled_date, start_time, end_time, location } = req.body;

    // Validation
    if (!scheduled_date || !start_time || !end_time) {
      return res.status(400).json({
        success: false,
        message: 'scheduled_date, start_time, and end_time are required'
      });
    }

    // Find the appointment
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Check if already processed
    if (appointment.status !== 'requested') {
      return res.status(400).json({
        success: false,
        message: `Appointment is already ${appointment.status}`
      });
    }

    // Parse time strings (HH:MM) and combine with scheduled_date
    const [startHour, startMinute] = start_time.split(':').map(Number);
    const [endHour, endMinute] = end_time.split(':').map(Number);
    
    const startDateTime = new Date(scheduled_date);
    startDateTime.setHours(startHour, startMinute, 0, 0);
    
    const endDateTime = new Date(scheduled_date);
    endDateTime.setHours(endHour, endMinute, 0, 0);

    // Validate end time is after start time
    if (endDateTime <= startDateTime) {
      return res.status(400).json({
        success: false,
        message: 'end_time must be after start_time'
      });
    }

    // Calculate duration in minutes
    const duration = Math.round((endDateTime - startDateTime) / 60000);

    // Update appointment with approval details
    appointment.status = 'approved';
    appointment.scheduled_date = new Date(scheduled_date);
    appointment.start_time = startDateTime;
    appointment.end_time = endDateTime;
    appointment.duration_minutes = duration;
    appointment.location = location || null;
    appointment.approved_at = new Date();

    await appointment.save();
    
    // Populate patient information
    await appointment.populate('patient_id', 'first_name last_name email phone_number');

    // TODO: Trigger notification to patient

    res.status(200).json({
      success: true,
      message: 'Appointment approved successfully',
      data: appointment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reject appointment request
// @route   PATCH /api/appointments/:id/reject
// @access  Public
exports.rejectAppointment = async (req, res, next) => {
  try {
    const { rejection_reason } = req.body;

    // Validation
    if (!rejection_reason || rejection_reason.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'rejection_reason is required'
      });
    }

    // Find the appointment
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Check if already processed
    if (appointment.status !== 'requested') {
      return res.status(400).json({
        success: false,
        message: `Appointment is already ${appointment.status}`
      });
    }

    // Update appointment with rejection details
    appointment.status = 'rejected';
    appointment.rejection_reason = rejection_reason;
    appointment.rejected_at = new Date();

    await appointment.save();
    
    // Populate patient information
    await appointment.populate('patient_id', 'first_name last_name email phone_number');

    // TODO: Trigger notification to patient

    res.status(200).json({
      success: true,
      message: 'Appointment rejected successfully',
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
