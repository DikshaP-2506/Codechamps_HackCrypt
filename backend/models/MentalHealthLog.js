const mongoose = require('mongoose');

const mentalHealthLogSchema = new mongoose.Schema({
  patient_id: {
    type: String,
    required: true,
    index: true
  },
  recorded_by: {
    type: String,
    required: true
  },
  recorded_date: {
    type: Date,
    default: Date.now,
    required: true
  },

  mood_rating: {
    type: Number,
    min: 1,
    max: 10,
    required: false
  },
  stress_level: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'low', 'medium', 'high'],
    required: false
  },
  anxiety_level: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'low', 'medium', 'high'],
    required: false
  },
  sleep_hours: {
    type: Number,
    min: 0,
    max: 24,
    required: false
  },
  sleep_quality: {
    type: Number,
    min: 1,
    max: 10,
    required: false
  },
  phq9_score: {
    type: Number,
    min: 0,
    max: 27,
    required: false,
    comment: 'PHQ-9 Depression Scale (0-27)'
  },
  gad7_score: {
    type: Number,
    min: 0,
    max: 21,
    required: false,
    comment: 'GAD-7 Anxiety Scale (0-21)'
  },
  notes: {
    type: String,
    required: false
  }
}, {
  timestamps: true,
  collection: 'mental_health_logs'
});

// Indexes for efficient querying
mentalHealthLogSchema.index({ patient_id: 1, recorded_date: -1 });
mentalHealthLogSchema.index({ recorded_by: 1 });

// Virtual for anxiety severity
mentalHealthLogSchema.virtual('gad7_severity').get(function() {
  if (!this.gad7_score) return null;
  if (this.gad7_score <= 4) return 'Minimal';
  if (this.gad7_score <= 9) return 'Mild';
  if (this.gad7_score <= 14) return 'Moderate';
  return 'Severe';
});

// Virtual for depression severity
mentalHealthLogSchema.virtual('phq9_severity').get(function() {
  if (!this.phq9_score) return null;
  
  if (this.phq9_score <= 4) return 'Minimal';
  if (this.phq9_score <= 9) return 'Mild';
  if (this.phq9_score <= 14) return 'Moderate';
  if (this.phq9_score <= 19) return 'Moderately Severe';
  return 'Severe';
});

// Ensure virtuals are included in JSON
mentalHealthLogSchema.set('toJSON', { virtuals: true });
mentalHealthLogSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('MentalHealthLog', mentalHealthLogSchema);
