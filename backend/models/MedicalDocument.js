const mongoose = require('mongoose');

const medicalDocumentSchema = new mongoose.Schema({
  // Primary identifier
  uuid: {
    type: String,
    required: true,
    unique: true,
    default: () => require('crypto').randomUUID()
  },

  // Foreign keys - Mixed type for flexibility
  patient_id: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
    index: true
  },

  uploaded_by: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
    index: true
  },

  // File information
  file_name: {
    type: String,
    required: true,
    maxlength: 255
  },

  file_url: {
    type: String,
    required: true, // Cloudinary URL
    maxlength: 500
  },

  cloudinary_public_id: {
    type: String, // For deletion/updates
    maxlength: 255
  },

  file_size: {
    type: Number, // Size in bytes
    required: true
  },

  file_type: {
    type: String, // MIME type (image/jpeg, application/pdf, etc.)
    required: true
  },

  // Document classification
  document_type: {
    type: String,
    required: true,
    enum: [
      'lab_report',
      'x_ray',
      'mri_scan',
      'ct_scan',
      'ultrasound',
      'ecg',
      'therapy_note',
      'prescription',
      'discharge_summary',
      'symptom_photo',
      'wound_progress',
      'medical_certificate',
      'vaccination_record',
      'insurance_document',
      'consent_form',
      'other'
    ],
    index: true
  },

  category: {
    type: String,
    enum: ['radiology', 'pathology', 'cardiology', 'general', 'progress_tracking', 'administrative', 'other'],
    default: 'general',
    index: true
  },

  // AI and OCR features
  is_ai_verified: {
    type: Boolean,
    default: false
  },

  ocr_extracted_text: {
    type: String,
    default: ''
  },

  ai_detected_conditions: {
    type: [String], // AI-detected medical conditions from document
    default: []
  },

  // Metadata
  description: {
    type: String,
    maxlength: 500
  },

  tags: {
    type: [String],
    default: []
  },

  // Version control
  version: {
    type: Number,
    default: 1
  },

  parent_document_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MedicalDocument',
    default: null
  },

  is_latest_version: {
    type: Boolean,
    default: true
  },

  // Sharing and permissions
  shared_with: [{
    user_id: {
      type: mongoose.Schema.Types.Mixed
    },
    user_role: {
      type: String,
      enum: ['doctor', 'nurse', 'lab_reporter', 'patient', 'admin']
    },
    permission: {
      type: String,
      enum: ['view', 'download', 'edit'],
      default: 'view'
    },
    shared_at: {
      type: Date,
      default: Date.now
    }
  }],

  // Access logs
  access_logs: [{
    accessed_by: {
      type: mongoose.Schema.Types.Mixed
    },
    accessed_at: {
      type: Date,
      default: Date.now
    },
    action: {
      type: String,
      enum: ['viewed', 'downloaded', 'shared', 'updated', 'deleted']
    },
    ip_address: String
  }],

  // Status
  is_active: {
    type: Boolean,
    default: true
  },

  is_deleted: {
    type: Boolean,
    default: false
  },

  uploaded_at: {
    type: Date,
    default: Date.now,
    index: true
  },

  updated_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  collection: 'medical_documents'
});

// Indexes for performance
medicalDocumentSchema.index({ patient_id: 1, document_type: 1 });
medicalDocumentSchema.index({ uploaded_by: 1, uploaded_at: -1 });
medicalDocumentSchema.index({ is_active: 1, is_deleted: 1 });
medicalDocumentSchema.index({ category: 1, document_type: 1 });

// Virtual for file extension
medicalDocumentSchema.virtual('file_extension').get(function() {
  return this.file_name.split('.').pop().toLowerCase();
});

// Virtual for readable file size
medicalDocumentSchema.virtual('readable_file_size').get(function() {
  const bytes = this.file_size;
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
});

// Virtual for document age
medicalDocumentSchema.virtual('document_age_days').get(function() {
  const now = new Date();
  const uploaded = new Date(this.uploaded_at);
  const diffTime = Math.abs(now - uploaded);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Virtual for version history count
medicalDocumentSchema.virtual('version_count', {
  ref: 'MedicalDocument',
  localField: '_id',
  foreignField: 'parent_document_id',
  count: true
});

// Update timestamp before save
medicalDocumentSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

// Method to add access log
medicalDocumentSchema.methods.addAccessLog = function(accessedBy, action, ipAddress) {
  this.access_logs.push({
    accessed_by: accessedBy,
    accessed_at: new Date(),
    action: action,
    ip_address: ipAddress
  });
  return this.save();
};

// Method to share document
medicalDocumentSchema.methods.shareWithUser = function(userId, userRole, permission) {
  // Check if already shared
  const existing = this.shared_with.find(s => s.user_id.toString() === userId.toString());
  if (existing) {
    existing.permission = permission;
  } else {
    this.shared_with.push({
      user_id: userId,
      user_role: userRole,
      permission: permission,
      shared_at: new Date()
    });
  }
  return this.save();
};

// Method to revoke sharing
medicalDocumentSchema.methods.revokeSharing = function(userId) {
  this.shared_with = this.shared_with.filter(s => s.user_id.toString() !== userId.toString());
  return this.save();
};

// Static method for auto-categorization
medicalDocumentSchema.statics.autoCategorizeDOcument = function(documentType) {
  const categoryMap = {
    'x_ray': 'radiology',
    'mri_scan': 'radiology',
    'ct_scan': 'radiology',
    'ultrasound': 'radiology',
    'ecg': 'cardiology',
    'lab_report': 'pathology',
    'symptom_photo': 'progress_tracking',
    'wound_progress': 'progress_tracking',
    'medical_certificate': 'administrative',
    'insurance_document': 'administrative',
    'consent_form': 'administrative'
  };
  return categoryMap[documentType] || 'general';
};

module.exports = mongoose.model('MedicalDocument', medicalDocumentSchema);
