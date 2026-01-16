const mongoose = require('mongoose');

// Schema matching the NOTIFICATIONS table structure
const notificationSchema = new mongoose.Schema({
  // Foreign Keys
  recipient_id: {
    type: mongoose.Schema.Types.Mixed,
    required: [true, 'Recipient ID is required']
  },
  
  patient_id: {
    type: mongoose.Schema.Types.Mixed,
    required: [true, 'Patient ID is required']
  },

  // Notification Type
  notification_type: {
    type: String,
    enum: ['appointment_reminder', 'prescription_refill', 'lab_result', 'health_alert', 'system_update', 'message', 'payment_due', 'emergency'],
    required: [true, 'Notification type is required'],
    trim: true
  },

  // Content
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },

  body: {
    type: String,
    required: [true, 'Body is required'],
    trim: true,
    maxlength: [2000, 'Body cannot exceed 2000 characters']
  },

  // Additional data (flexible JSON object)
  data: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },

  // Status
  is_read: {
    type: Boolean,
    default: false
  },

  // Timestamps
  sent_at: {
    type: Date,
    default: Date.now,
    required: [true, 'Sent timestamp is required']
  },

  read_at: {
    type: Date,
    default: null
  }

}, {
  timestamps: false, // Using sent_at manually
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual to check if notification is unread
notificationSchema.virtual('is_unread').get(function() {
  return !this.is_read;
});

// Virtual to get time since sent
notificationSchema.virtual('time_ago').get(function() {
  if (this.sent_at) {
    const now = new Date();
    const diffMs = now - new Date(this.sent_at);
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  }
  return null;
});

// Indexes for better query performance
notificationSchema.index({ recipient_id: 1 });
notificationSchema.index({ patient_id: 1 });
notificationSchema.index({ notification_type: 1 });
notificationSchema.index({ is_read: 1 });
notificationSchema.index({ sent_at: -1 });
notificationSchema.index({ recipient_id: 1, is_read: 1 });
notificationSchema.index({ recipient_id: 1, sent_at: -1 });

// Use existing collection name from your database
const Notification = mongoose.model('Notification', notificationSchema, 'notifications');

module.exports = Notification;
