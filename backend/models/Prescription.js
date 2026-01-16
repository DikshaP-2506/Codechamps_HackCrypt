const mongoose = require('mongoose');

// Schema matching the PRESCRIPTION table structure
const prescriptionSchema = new mongoose.Schema({
  // Foreign Keys
  patient_id: {
    type: mongoose.Schema.Types.Mixed,
    required: [true, 'Patient ID is required']
  },
  
  doctor_id: {
    type: mongoose.Schema.Types.Mixed,
    required: [true, 'Doctor ID is required']
  },

  // Timestamp
  created_at: {
    type: Date,
    default: Date.now,
    required: [true, 'Creation timestamp is required']
  },

  // Medication Details
  medication_name: {
    type: String,
    required: [true, 'Medication name is required'],
    trim: true,
    maxlength: [200, 'Medication name cannot exceed 200 characters']
  },

  dosage: {
    type: String,
    required: [true, 'Dosage is required'],
    trim: true,
    maxlength: [100, 'Dosage cannot exceed 100 characters']
  },

  frequency: {
    type: String,
    required: [true, 'Frequency is required'],
    trim: true,
    maxlength: [100, 'Frequency cannot exceed 100 characters']
  },

  duration_days: {
    type: Number,
    required: [true, 'Duration in days is required'],
    min: [1, 'Duration must be at least 1 day'],
    max: [365, 'Duration cannot exceed 365 days']
  },

  instructions: {
    type: String,
    trim: true,
    maxlength: [1000, 'Instructions cannot exceed 1000 characters']
  },

  // QR Code
  qr_code_url: {
    type: String,
    trim: true,
    maxlength: [500, 'QR code URL cannot exceed 500 characters']
  },

  // Status
  is_active: {
    type: Boolean,
    default: true
  },

  completed_at: {
    type: Date,
    default: null
  }

}, {
  timestamps: false, // We're using created_at manually
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual to check if prescription is expired
prescriptionSchema.virtual('is_expired').get(function() {
  if (this.created_at && this.duration_days) {
    const expiryDate = new Date(this.created_at);
    expiryDate.setDate(expiryDate.getDate() + this.duration_days);
    return new Date() > expiryDate;
  }
  return false;
});

// Virtual to get expiry date
prescriptionSchema.virtual('expiry_date').get(function() {
  if (this.created_at && this.duration_days) {
    const expiryDate = new Date(this.created_at);
    expiryDate.setDate(expiryDate.getDate() + this.duration_days);
    return expiryDate;
  }
  return null;
});

// Virtual to get days remaining
prescriptionSchema.virtual('days_remaining').get(function() {
  if (this.created_at && this.duration_days) {
    const expiryDate = new Date(this.created_at);
    expiryDate.setDate(expiryDate.getDate() + this.duration_days);
    const today = new Date();
    const diffTime = expiryDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  }
  return 0;
});

// Indexes for better query performance
prescriptionSchema.index({ patient_id: 1 });
prescriptionSchema.index({ doctor_id: 1 });
prescriptionSchema.index({ created_at: -1 });
prescriptionSchema.index({ is_active: 1 });

// Use existing collection name from your database
const Prescription = mongoose.model('Prescription', prescriptionSchema, 'prescription');

module.exports = Prescription;
