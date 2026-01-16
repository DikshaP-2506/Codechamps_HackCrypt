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
    enum: ['scheduled', 'confirmed', 'completed', 'cancelled', 'no-show', 'rescheduled'],
    default: 'scheduled',
    trim: true
  },

  // Appointment Type
  appointment_type: {
    type: String,
    enum: ['in_person', 'video_call', 'phone_call', 'consultation', 'follow_up', 'therapy_session', 'emergency'],
    required: [true, 'Appointment type is required'],
    trim: true
  },

  // Scheduling
  start_time: {
    type: Date,
    required: [true, 'Start time is required']
  },

  duration_minutes: {
    type: Number,
    required: [true, 'Duration is required'],
    min: [5, 'Duration must be at least 5 minutes'],
    max: [480, 'Duration cannot exceed 8 hours']
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

// Virtual to calculate end time
appointmentSchema.virtual('end_time').get(function() {
  if (this.start_time && this.duration_minutes) {
    const endTime = new Date(this.start_time);
    endTime.setMinutes(endTime.getMinutes() + this.duration_minutes);
    return endTime;
  }
  return null;
});

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
