const { body, validationResult } = require('express-validator');

// Validation rules for creating/updating patient
exports.validatePatient = [
  // Clerk user ID (optional)
  body('clerk_user_id')
    .optional()
    .trim()
    .isString()
    .withMessage('Clerk user ID must be a string'),

  // Basic patient information
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 100 })
    .withMessage('Name cannot exceed 100 characters'),

  body('date_of_birth')
    .notEmpty()
    .withMessage('Date of birth is required')
    .isISO8601()
    .withMessage('Please provide a valid date')
    .custom((value) => {
      const dob = new Date(value);
      const today = new Date();
      if (dob >= today) {
        throw new Error('Date of birth must be in the past');
      }
      // Check if age is reasonable (0-150 years)
      const age = today.getFullYear() - dob.getFullYear();
      if (age > 150) {
        throw new Error('Please provide a valid date of birth');
      }
      return true;
    }),

  body('gender')
    .notEmpty()
    .withMessage('Gender is required')
    .isIn(['Male', 'Female', 'Other', 'Prefer not to say'])
    .withMessage('Please select a valid gender option'),

  body('blood_group')
    .optional()
    .isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown', ''])
    .withMessage('Please select a valid blood group'),

  body('emergency_contact_name')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Emergency contact name cannot exceed 100 characters'),

  body('emergency_contact_phone')
    .trim()
    .notEmpty()
    .withMessage('Emergency contact phone is required')
    .matches(/^[\d\s\-\+\(\)]+$/)
    .withMessage('Please provide a valid phone number'),

  body('address')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Address cannot exceed 500 characters'),

  body('role')
    .optional()
    .isIn(['patient', 'doctor', 'admin', 'staff'])
    .withMessage('Please select a valid role'),

  body('is_active')
    .optional()
    .isBoolean()
    .withMessage('is_active must be a boolean value'),

  // Middleware to handle validation errors
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array().map(err => ({
          field: err.path,
          message: err.msg
        }))
      });
    }
    next();
  }
];

// Validation for auto-save (less strict)
exports.validateAutoSave = [
  body('date_of_birth')
    .optional()
    .isISO8601()
    .withMessage('Please provide a valid date'),

  body('gender')
    .optional()
    .isIn(['Male', 'Female', 'Other', 'Prefer not to say'])
    .withMessage('Please select a valid gender option'),

  body('blood_group')
    .optional()
    .isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown', ''])
    .withMessage('Please select a valid blood group'),

  body('emergency_contact_phone')
    .optional()
    .matches(/^[\d\s\-\+\(\)]+$/)
    .withMessage('Please provide a valid phone number'),

  body('is_active')
    .optional()
    .isBoolean()
    .withMessage('is_active must be a boolean value'),

  // Middleware to handle validation errors
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array().map(err => ({
          field: err.path,
          message: err.msg
        }))
      });
    }
    next();
  }
];

// Validation for physical vitals
exports.validateVital = [
  body('patient_id')
    .notEmpty()
    .withMessage('Patient ID is required'),

  body('recorded_at')
    .optional()
    .isISO8601()
    .withMessage('Please provide a valid date'),

  body('systolic_bp')
    .optional()
    .isInt({ min: 0, max: 300 })
    .withMessage('Systolic BP must be between 0 and 300'),

  body('diastolic_bp')
    .optional()
    .isInt({ min: 0, max: 200 })
    .withMessage('Diastolic BP must be between 0 and 200'),

  body('heart_rate')
    .optional()
    .isInt({ min: 0, max: 300 })
    .withMessage('Heart rate must be between 0 and 300'),

  body('blood_sugar')
    .optional()
    .isFloat({ min: 0, max: 1000 })
    .withMessage('Blood sugar must be between 0 and 1000'),

  body('respiratory_rate')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('Respiratory rate must be between 0 and 100'),

  body('temperature')
    .optional()
    .isFloat({ min: 90, max: 110 })
    .withMessage('Temperature must be between 90 and 110'),

  body('spo2')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('SpO2 must be between 0 and 100'),

  body('weight')
    .optional()
    .isFloat({ min: 0, max: 500 })
    .withMessage('Weight must be between 0 and 500'),

  body('hb')
    .optional()
    .isFloat({ min: 0, max: 25 })
    .withMessage('Hemoglobin must be between 0 and 25'),

  body('bmi')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('BMI must be between 0 and 100'),

  body('measurement_method')
    .optional()
    .isIn(['manual_entry', 'patient_sync', 'wearable_api', 'clinical_device', 'other'])
    .withMessage('Please select a valid measurement method'),

  body('notes')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Notes cannot exceed 1000 characters'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array().map(err => ({
          field: err.path,
          message: err.msg
        }))
      });
    }
    next();
  }
];

// Validation for prescriptions
exports.validatePrescription = [
  body('patient_id')
    .notEmpty()
    .withMessage('Patient ID is required'),

  body('doctor_id')
    .notEmpty()
    .withMessage('Doctor ID is required'),

  body('medication_name')
    .trim()
    .notEmpty()
    .withMessage('Medication name is required')
    .isLength({ max: 200 })
    .withMessage('Medication name cannot exceed 200 characters'),

  body('dosage')
    .trim()
    .notEmpty()
    .withMessage('Dosage is required')
    .isLength({ max: 100 })
    .withMessage('Dosage cannot exceed 100 characters'),

  body('frequency')
    .trim()
    .notEmpty()
    .withMessage('Frequency is required')
    .isLength({ max: 100 })
    .withMessage('Frequency cannot exceed 100 characters'),

  body('duration_days')
    .notEmpty()
    .withMessage('Duration in days is required')
    .isInt({ min: 1, max: 365 })
    .withMessage('Duration must be between 1 and 365 days')
    .toInt(),

  body('instructions')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Instructions cannot exceed 1000 characters'),

  body('qr_code_url')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('QR code URL cannot exceed 500 characters')
    .isURL()
    .withMessage('Please provide a valid URL'),

  body('is_active')
    .optional()
    .isBoolean()
    .withMessage('is_active must be a boolean value'),

  body('completed_at')
    .optional()
    .isISO8601()
    .withMessage('Please provide a valid date'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array().map(err => ({
          field: err.path,
          message: err.msg
        }))
      });
    }
    next();
  }
];

// Validation for appointments
exports.validateAppointment = [
  body('patient_id')
    .notEmpty()
    .withMessage('Patient ID is required'),

  body('doctor_id')
    .notEmpty()
    .withMessage('Doctor ID is required'),

  body('status')
    .optional()
    .isIn(['scheduled', 'confirmed', 'completed', 'cancelled', 'no-show', 'rescheduled'])
    .withMessage('Please select a valid status'),

  body('appointment_type')
    .notEmpty()
    .withMessage('Appointment type is required')
    .isIn(['in_person', 'video_call', 'phone_call', 'consultation', 'follow_up', 'therapy_session', 'emergency'])
    .withMessage('Please select a valid appointment type'),

  body('start_time')
    .notEmpty()
    .withMessage('Start time is required')
    .isISO8601()
    .withMessage('Please provide a valid date and time')
    .custom((value) => {
      const appointmentDate = new Date(value);
      const now = new Date();
      if (appointmentDate < now) {
        throw new Error('Appointment time cannot be in the past');
      }
      return true;
    }),

  body('duration_minutes')
    .notEmpty()
    .withMessage('Duration is required')
    .isInt({ min: 5, max: 480 })
    .withMessage('Duration must be between 5 and 480 minutes')
    .toInt(),

  body('notes')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Notes cannot exceed 2000 characters'),

  body('is_recurring')
    .optional()
    .isBoolean()
    .withMessage('is_recurring must be a boolean value'),

  body('recurrence_pattern')
    .optional()
    .isIn(['none', 'daily', 'weekly', 'biweekly', 'monthly'])
    .withMessage('Please select a valid recurrence pattern'),

  body('recurrence_end_date')
    .optional()
    .isISO8601()
    .withMessage('Please provide a valid end date'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array().map(err => ({
          field: err.path,
          message: err.msg
        }))
      });
    }
    next();
  }
];

// Validation rules for creating/updating notification
exports.validateNotification = [
  // Recipient ID (who receives the notification)
  body('recipient_id')
    .notEmpty()
    .withMessage('Recipient ID is required'),

  // Patient ID (related patient)
  body('patient_id')
    .optional(),

  // Notification type
  body('notification_type')
    .notEmpty()
    .withMessage('Notification type is required')
    .isIn(['appointment_reminder', 'prescription_refill', 'lab_result', 'health_alert', 'system_update', 'message', 'payment_due', 'emergency'])
    .withMessage('Please select a valid notification type'),

  // Title
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 200 })
    .withMessage('Title cannot exceed 200 characters'),

  // Body
  body('body')
    .trim()
    .notEmpty()
    .withMessage('Body is required')
    .isLength({ max: 2000 })
    .withMessage('Body cannot exceed 2000 characters'),

  // Data (optional JSON object)
  body('data')
    .optional()
    .custom((value) => {
      if (value && typeof value !== 'object') {
        throw new Error('Data must be a valid JSON object');
      }
      return true;
    }),

  // Is read status
  body('is_read')
    .optional()
    .isBoolean()
    .withMessage('is_read must be a boolean'),

  // Middleware to handle validation errors
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array().map(err => ({
          field: err.path,
          message: err.msg
        }))
      });
    }
    next();
  }
];
