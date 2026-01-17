const mongoose = require('mongoose');

// Schema matching the APPOINTMENTS table structure
const appointmentSchema = new mongoose.Schema({
  // Foreign Keys
  patient_id: {
    type: mongoose.Schema.Types.Mixed,
    required: [true, 'Patient ID is required']
  },
  
  doctor_id: {
    type: mongoose.Schema.Types.Mixed,
    required: [true, 'Doctor ID is required']
  },

  // Status
  status: {
    type: String,
    enum: ['requested', 'approved', 'rejected', 'scheduled', 'confirmed', 'completed', 'cancelled', 'no-show', 'rescheduled'],
    default: 'requested',
    trim: true
  },

  // Appointment Type
  appointment_type: {
    type: String,
    enum: ['in_person', 'virtual', 'follow_up', 'video_call', 'phone_call', 'consultation', 'therapy_session', 'emergency'],
    required: [true, 'Appointment type is required'],
    trim: true
  },

  // Scheduling
  scheduled_date: {
    type: Date,
    required: false // Set when approved
  },

  start_time: {
    type: Date,
    required: false // Not required for "requested" status
  },

  end_time: {
    type: Date,
    required: false // Set when approved
  },

  duration_minutes: {
    type: Number,
    required: false, // Not required for "requested" status
    min: [5, 'Duration must be at least 5 minutes'],
    max: [480, 'Duration cannot exceed 8 hours']
  },

  // Request-specific fields
  preferred_dates: [{
    type: Date
  }],

  preferred_times: [{
    type: String,
    enum: ['Morning (9-12)', 'Afternoon (12-3)', 'Evening (3-6)']
  }],

  reason: {
    type: String,
    trim: true,
    maxlength: [1000, 'Reason cannot exceed 1000 characters']
  },

  location: {
    type: String,
    trim: true
  },

  // Notes
  notes: {
    type: String,
    trim: true,
    maxlength: [2000, 'Notes cannot exceed 2000 characters']
  },

  // Reminder tracking
  reminder_sent_24h: {
    type: Boolean,
    default: false
  },

  reminder_sent_1h: {
    type: Boolean,
    default: false
  },

  // Approval/Rejection tracking
  approved_at: {
    type: Date
  },

  rejected_at: {
    type: Date
  },

  rejection_reason: {
    type: String,
    trim: true,
    maxlength: [500, 'Rejection reason cannot exceed 500 characters']
  },

  // Recurring appointment support
  is_recurring: {
    type: Boolean,
    default: false
  },

  recurrence_pattern: {
    type: String,
    enum: ['none', 'daily', 'weekly', 'biweekly', 'monthly'],
    default: 'none'
  },

  recurrence_end_date: {
    type: Date
  },

  parent_appointment_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
  }

}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Note: end_time is now a real field in the schema, not a virtual field

// Virtual to check if appointment is upcoming
appointmentSchema.virtual('is_upcoming').get(function() {
  if (this.start_time) {
    return new Date(this.start_time) > new Date();
  }
  return false;
});

// Virtual to check if appointment is past
appointmentSchema.virtual('is_past').get(function() {
  if (this.start_time && this.duration_minutes) {
    const endTime = new Date(this.start_time);
    endTime.setMinutes(endTime.getMinutes() + this.duration_minutes);
    return endTime < new Date();
  }
  return false;
});

// Virtual to get time until appointment
appointmentSchema.virtual('time_until').get(function() {
  if (this.start_time) {
    const now = new Date();
    const diffMs = new Date(this.start_time) - now;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    return diffHours > 0 ? `${diffHours} hours` : 'Past appointment';
  }
  return null;
});

// Indexes for better query performance
appointmentSchema.index({ patient_id: 1 });
appointmentSchema.index({ doctor_id: 1 });
appointmentSchema.index({ start_time: 1 });
appointmentSchema.index({ status: 1 });
appointmentSchema.index({ created_at: -1 });
appointmentSchema.index({ patient_id: 1, start_time: 1 });
appointmentSchema.index({ doctor_id: 1, start_time: 1 });

// Use existing collection name from your database
const Appointment = mongoose.model('Appointment', appointmentSchema, 'appointments');

module.exports = Appointment;
