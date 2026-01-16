const mongoose = require('mongoose');

// Schema matching the PATIENTS table structure
const patientProfileSchema = new mongoose.Schema({
  // Clerk Authentication
  clerk_user_id: {
    type: String,
    trim: true,
    sparse: true // Allows multiple null values but unique non-null values
  },

  // Foreign Keys
  user_id: {
    type: mongoose.Schema.Types.Mixed,
    required: false
  },
  
  primary_doctor_id: {
    type: mongoose.Schema.Types.Mixed,
    required: false
  },

  // Basic Patient Information
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },

  date_of_birth: {
    type: Date,
    required: [true, 'Date of birth is required'],
    validate: {
      validator: function(value) {
        return value < new Date();
      },
      message: 'Date of birth must be in the past'
    }
  },

  gender: {
    type: String,
    required: [true, 'Gender is required'],
    enum: ['Male', 'Female', 'Other', 'Prefer not to say'],
    trim: true
  },

  blood_group: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown', ''],
    trim: true,
    default: ''
  },

  emergency_contact_name: {
    type: String,
    trim: true,
    maxlength: [100, 'Emergency contact name cannot exceed 100 characters']
  },

  emergency_contact_phone: {
    type: String,
    required: [true, 'Emergency contact phone is required'],
    trim: true,
    match: [/^[\d\s\-\+\(\)]+$/, 'Please enter a valid phone number']
  },

  address: {
    type: String,
    trim: true,
    maxlength: [500, 'Address cannot exceed 500 characters']
  },

  // Medical Information Arrays (stored as text in original schema)
  allergies: {
    type: [String],
    default: []
  },

  chronic_conditions: {
    type: [String],
    default: []
  },

  past_surgeries: {
    type: [String],
    default: []
  },

  family_history: {
    type: String,
    trim: true,
    default: ''
  },

  // Status
  is_active: {
    type: Boolean,
    default: true
  },

  // User Role
  role: {
    type: String,
    enum: ['patient', 'doctor', 'admin', 'staff'],
    default: 'patient',
    trim: true
  }

}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual field to calculate age
patientProfileSchema.virtual('age').get(function() {
  if (this.date_of_birth) {
    const today = new Date();
    const birthDate = new Date(this.date_of_birth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }
  return null;
});

// Indexes for better query performance
patientProfileSchema.index({ user_id: 1 });
patientProfileSchema.index({ primary_doctor_id: 1 });
patientProfileSchema.index({ name: 1 });
patientProfileSchema.index({ is_active: 1 });
patientProfileSchema.index({ role: 1 });
patientProfileSchema.index({ created_at: -1 });
patientProfileSchema.index({ updated_at: -1 });

// Use existing collection name from your database
const PatientProfile = mongoose.model('PatientProfile', patientProfileSchema, 'patients');

module.exports = PatientProfile;
