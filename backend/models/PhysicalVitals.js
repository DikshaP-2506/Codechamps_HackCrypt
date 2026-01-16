const mongoose = require('mongoose');

// Schema matching the PHYSICAL_VITALS table structure
const physicalVitalsSchema = new mongoose.Schema({
  // Foreign Keys
  patient_id: {
    type: mongoose.Schema.Types.Mixed,
    required: [true, 'Patient ID is required']
  },
  
  recorded_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Can be optional if self-recorded
  },

  // Timestamp
  recorded_at: {
    type: Date,
    default: Date.now,
    required: [true, 'Recording timestamp is required']
  },

  // Vital Signs
  systolic_bp: {
    type: Number,
    min: [0, 'Systolic BP cannot be negative'],
    max: [300, 'Systolic BP seems too high']
  },

  diastolic_bp: {
    type: Number,
    min: [0, 'Diastolic BP cannot be negative'],
    max: [200, 'Diastolic BP seems too high']
  },

  heart_rate: {
    type: Number,
    min: [0, 'Heart rate cannot be negative'],
    max: [300, 'Heart rate seems too high']
  },

  blood_sugar: {
    type: Number,
    min: [0, 'Blood sugar cannot be negative'],
    max: [1000, 'Blood sugar seems too high']
  },

  respiratory_rate: {
    type: Number,
    min: [0, 'Respiratory rate cannot be negative'],
    max: [100, 'Respiratory rate seems too high']
  },

  temperature: {
    type: Number,
    min: [90, 'Temperature seems too low'],
    max: [110, 'Temperature seems too high']
  },

  spo2: {
    type: Number,
    min: [0, 'SpO2 cannot be negative'],
    max: [100, 'SpO2 cannot exceed 100%']
  },

  weight: {
    type: Number,
    min: [0, 'Weight cannot be negative'],
    max: [500, 'Weight seems too high']
  },

  hb: {
    type: Number,
    min: [0, 'Hemoglobin cannot be negative'],
    max: [25, 'Hemoglobin seems too high']
  },

  bmi: {
    type: Number,
    min: [0, 'BMI cannot be negative'],
    max: [100, 'BMI seems too high']
  },

  // Metadata
  measurement_method: {
    type: String,
    enum: ['manual_entry', 'patient_sync', 'wearable_api', 'clinical_device', 'other'],
    default: 'manual_entry',
    trim: true
  },

  notes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  }

}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual to check if blood pressure is normal
physicalVitalsSchema.virtual('bp_status').get(function() {
  if (this.systolic_bp && this.diastolic_bp) {
    if (this.systolic_bp < 120 && this.diastolic_bp < 80) return 'Normal';
    if (this.systolic_bp < 130 && this.diastolic_bp < 80) return 'Elevated';
    if (this.systolic_bp < 140 || this.diastolic_bp < 90) return 'High Stage 1';
    if (this.systolic_bp < 180 || this.diastolic_bp < 120) return 'High Stage 2';
    return 'Hypertensive Crisis';
  }
  return null;
});

// Virtual to check temperature status
physicalVitalsSchema.virtual('temp_status').get(function() {
  if (this.temperature) {
    if (this.temperature < 97) return 'Low';
    if (this.temperature <= 99) return 'Normal';
    if (this.temperature <= 100.4) return 'Slight Fever';
    if (this.temperature <= 103) return 'Fever';
    return 'High Fever';
  }
  return null;
});

// Indexes for better query performance
physicalVitalsSchema.index({ patient_id: 1 });
physicalVitalsSchema.index({ recorded_by: 1 });
physicalVitalsSchema.index({ recorded_at: -1 });
physicalVitalsSchema.index({ created_at: -1 });

// Use existing collection name from your database
const PhysicalVitals = mongoose.model('PhysicalVitals', physicalVitalsSchema, 'physical_vitals');

module.exports = PhysicalVitals;
