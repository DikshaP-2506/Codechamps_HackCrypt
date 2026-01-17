const MedicalDocument = require('../models/MedicalDocument');
const { uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');
const Notification = require('../models/Notification');
const PatientProfile = require('../models/PatientProfile');
const mongoose = require('mongoose');

// Helper function to send notification to patient
async function sendPatientNotification(patientId, document) {
  try {
    await Notification.create({
      user_id: patientId,
      user_role: 'patient',
      notification_type: 'document_uploaded',
      title: 'New Medical Document Available',
      message: `A new ${document.document_type} has been uploaded to your medical records${document.report_details?.test_date ? ` for test dated ${new Date(document.report_details.test_date).toLocaleDateString()}` : ''}.`,
      priority: document.report_details?.priority || 'normal',
      metadata: {
        document_id: document._id,
        document_type: document.document_type,
        file_name: document.file_name
      }
    });

    // Update notification timestamp
    document.notifications.patient_notified_at = new Date();
    await document.save();
    
    console.log(`Patient notification sent for document ${document._id}`);
  } catch (error) {
    console.error('Error sending patient notification:', error);
  }
}

// Helper function to send notification to doctor
async function sendDoctorNotification(doctorId, document) {
  try {
    await Notification.create({
      user_id: doctorId,
      user_role: 'doctor',
      notification_type: 'document_uploaded',
      title: 'Lab Report Ready for Review',
      message: `A ${document.document_type} is ready for your review${document.report_details?.laboratory ? ` from ${document.report_details.laboratory}` : ''}.`,
      priority: document.report_details?.priority || 'normal',
      metadata: {
        document_id: document._id,
        document_type: document.document_type,
        patient_id: document.patient_id,
        file_name: document.file_name
      }
    });

    // Update notification timestamp
    document.notifications.doctor_notified_at = new Date();
    await document.save();
    
    console.log(`Doctor notification sent for document ${document._id}`);
  } catch (error) {
    console.error('Error sending doctor notification:', error);
  }
}

// @desc    Get all medical documents with filters
// @route   GET /api/medical-documents
// @access  Private
exports.getAllDocuments = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      patient_id,
      uploaded_by,
      document_type,
      category,
      is_active,
      search,
      sort_by = 'uploaded_at',
      sort_order = 'desc'
    } = req.query;

    // Build filter query
    const filter = { is_deleted: false };

    if (patient_id) filter.patient_id = patient_id;
    if (uploaded_by) filter.uploaded_by = uploaded_by;
    if (document_type) filter.document_type = document_type;
    if (category) filter.category = category;
    if (is_active !== undefined) filter.is_active = is_active === 'true';

    // Search in file name, description, tags, OCR text
    if (search) {
      filter.$or = [
        { file_name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
        { ocr_extracted_text: { $regex: search, $options: 'i' } }
      ];
    }

    // Pagination
    const skip = (page - 1) * limit;
    const sortOrder = sort_order === 'asc' ? 1 : -1;

    const documents = await MedicalDocument.find(filter)
      .sort({ [sort_by]: sortOrder })
      .limit(parseInt(limit))
      .skip(skip)
      .select('-access_logs'); // Exclude logs for performance

    const total = await MedicalDocument.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: documents.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: documents
    });
  } catch (error) {
    console.error('Get all documents error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving documents',
      error: error.message
    });
  }
};

// @desc    Get documents by patient identifier (supports clerk_user_id or MongoDB _id)
// @route   GET /api/medical-documents/patient/:patientId
// @access  Private
exports.getDocumentsByPatientId = async (req, res) => {
  try {
    const { patientId } = req.params;
    const { document_type, category, limit = 50 } = req.query;

    console.log('Fetching documents for patientId:', patientId);

    // Normalize identifier: prefer clerk_user_id, map from MongoDB _id when needed
    let clerkId = null;
    try {
      if (typeof patientId === 'string' && patientId.startsWith('user_')) {
        clerkId = patientId;
      } else if (/^[a-f0-9]{24}$/i.test(patientId)) {
        // Attempt to resolve via PatientProfile
        let patient = null;
        try {
          patient = await PatientProfile.findById(patientId).select('clerk_user_id user_id').lean();
        } catch (_) {}

        if (patient && patient.clerk_user_id) {
          clerkId = patient.clerk_user_id;
          console.log('Mapped Mongo _id to clerk_user_id via PatientProfile:', clerkId);
        } else if (patient && patient.user_id) {
          // Fallback: resolve via users collection using stored user_id
          const usersCollection = mongoose.connection.collection('users');
          const userDoc = await usersCollection.findOne({ _id: patient.user_id });
          if (userDoc && userDoc.clerk_user_id) {
            clerkId = userDoc.clerk_user_id;
            console.log('Mapped via users.user_id to clerk_user_id:', clerkId);
          }
        } else {
          // Final fallback: try users collection with provided _id
          const usersCollection = mongoose.connection.collection('users');
          let lookupId = null;
          try { lookupId = new mongoose.Types.ObjectId(patientId); } catch (_) {}
          if (lookupId) {
            const userDoc2 = await usersCollection.findOne({ _id: lookupId });
            if (userDoc2 && userDoc2.clerk_user_id) {
              clerkId = userDoc2.clerk_user_id;
              console.log('Mapped via users._id to clerk_user_id:', clerkId);
            }
          }
        }
      }
    } catch (mapErr) {
      console.warn('PatientId mapping error:', mapErr.message);
    }

    // Base filter: include documents not marked deleted; be lenient on is_active
    const baseFilter = {
      is_deleted: { $ne: true }
    };
    if (document_type) baseFilter.document_type = document_type;
    if (category) baseFilter.category = category;

    let documents = [];

    // Primary query by clerk_user_id when available
    if (clerkId) {
      const filterByClerk = { ...baseFilter, patient_id: clerkId };
      documents = await MedicalDocument.find(filterByClerk)
        .sort({ uploaded_at: -1 })
        .limit(parseInt(limit))
        .select('-access_logs');
      console.log(`Query by clerk_user_id=${clerkId}: ${documents.length} documents`);
    }

    // Fallback: direct match using provided patientId (supports legacy data)
    if (!documents.length) {
      const filterByStringId = { ...baseFilter, patient_id: patientId };
      const altDocs = await MedicalDocument.find(filterByStringId)
        .sort({ uploaded_at: -1 })
        .limit(parseInt(limit))
        .select('-access_logs');
      if (altDocs.length) {
        documents = altDocs;
        console.log(`Fallback by patientId=${patientId}: ${documents.length} documents`);
      }
    }

    // Fallback: ObjectId-based match when patient_id stored as ObjectId
    if (!documents.length && /^[a-f0-9]{24}$/i.test(patientId)) {
      let objId = null;
      try { objId = new mongoose.Types.ObjectId(patientId); } catch (_) {}
      if (objId) {
        const filterByObjId = { ...baseFilter, patient_id: objId };
        const idDocs = await MedicalDocument.find(filterByObjId)
          .sort({ uploaded_at: -1 })
          .limit(parseInt(limit))
          .select('-access_logs');
        if (idDocs.length) {
          documents = idDocs;
          console.log(`ObjectId patient_id match: ${documents.length} documents`);
        }
      }
    }

    console.log(`Found ${documents.length} documents for request identifier: ${patientId}`);

    res.status(200).json({
      success: true,
      count: documents.length,
      patient_id: clerkId || patientId,
      data: documents
    });
  } catch (error) {
    console.error('Get documents by patient error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving patient documents',
      error: error.message
    });
  }
};

// @desc    Get documents uploaded by user
// @route   GET /api/medical-documents/uploaded-by/:userId
// @access  Private
exports.getDocumentsByUploader = async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 50 } = req.query;

    const documents = await MedicalDocument.find({
      uploaded_by: userId,
      is_deleted: false
    })
      .sort({ uploaded_at: -1 })
      .limit(parseInt(limit))
      .select('-access_logs');

    res.status(200).json({
      success: true,
      count: documents.length,
      uploaded_by: userId,
      data: documents
    });
  } catch (error) {
    console.error('Get documents by uploader error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving uploaded documents',
      error: error.message
    });
  }
};

// @desc    Get single document by ID with access log
// @route   GET /api/medical-documents/:id
// @access  Private
exports.getDocumentById = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id, ip_address } = req.query;

    const document = await MedicalDocument.findById(id);

    if (!document || document.is_deleted) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    // Add access log
    if (user_id) {
      await document.addAccessLog(user_id, 'viewed', ip_address);
    }

    res.status(200).json({
      success: true,
      data: document
    });
  } catch (error) {
    console.error('Get document by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving document',
      error: error.message
    });
  }
};

// @desc    Create new medical document
// @route   POST /api/medical-documents/upload
// @access  Private
exports.createDocument = async (req, res) => {
  try {
    // Check if file was uploaded via multer
    if (req.file) {
      // Upload file to Cloudinary
      const uploadResult = await uploadToCloudinary(
        req.file.buffer,
        req.file.originalname,
        'medical_documents'
      );

      if (!uploadResult.success) {
        return res.status(500).json({
          success: false,
          message: 'Failed to upload file to Cloudinary',
          error: uploadResult.error
        });
      }

      // Extract data from request body and uploaded file
      const {
        patient_id,
        uploaded_by,
        document_type = 'other',
        description = '',
        tags = [],
        metadata,
        notify_patient = true,
        notify_doctor = true
      } = req.body;

      // Parse metadata if it's a string
      let reportDetails = {};
      if (metadata) {
        const parsedMetadata = typeof metadata === 'string' ? JSON.parse(metadata) : metadata;
        reportDetails = {
          test_date: parsedMetadata.test_date || null,
          laboratory: parsedMetadata.laboratory || '',
          test_category: parsedMetadata.test_category || '',
          priority: parsedMetadata.priority || 'normal',
          ordering_doctor: parsedMetadata.ordering_doctor || '',
          report_notes: parsedMetadata.report_notes || ''
        };
      }

      // Auto-categorize document
      const category = MedicalDocument.autoCategorizeDocument(document_type);

      // Create document in database
      const document = await MedicalDocument.create({
        patient_id,
        uploaded_by,
        file_name: req.file.originalname,
        file_url: uploadResult.url,
        cloudinary_public_id: uploadResult.public_id,
        file_size: uploadResult.size,
        file_type: req.file.mimetype,
        document_type,
        category,
        description,
        tags: Array.isArray(tags) ? tags : (tags ? [tags] : []),
        ocr_extracted_text: '',
        report_details: reportDetails,
        notifications: {
          notify_patient: notify_patient === 'true' || notify_patient === true,
          notify_doctor: notify_doctor === 'true' || notify_doctor === true,
          patient_notified_at: null,
          doctor_notified_at: null
        }
      });

      // Send notifications if enabled
      if (document.notifications.notify_patient) {
        await sendPatientNotification(patient_id, document);
      }
      if (document.notifications.notify_doctor && reportDetails.ordering_doctor) {
        await sendDoctorNotification(reportDetails.ordering_doctor, document);
      }

      return res.status(201).json({
        success: true,
        message: 'File uploaded successfully to Cloudinary',
        data: document,
        cloudinary: {
          url: uploadResult.url,
          public_id: uploadResult.public_id,
          format: uploadResult.format,
          size: uploadResult.size
        }
      });
    }

    // If no file uploaded, create document with provided URL (manual entry)
    const {
      patient_id,
      uploaded_by,
      file_name,
      file_url,
      cloudinary_public_id,
      file_size,
      file_type,
      document_type,
      description,
      tags,
      ocr_extracted_text
    } = req.body;

    // Auto-categorize document
    const category = MedicalDocument.autoCategorizeDOcument(document_type);

    const document = await MedicalDocument.create({
      patient_id,
      uploaded_by,
      file_name,
      file_url,
      cloudinary_public_id,
      file_size,
      file_type,
      document_type,
      category,
      description,
      tags: tags || [],
      ocr_extracted_text: ocr_extracted_text || ''
    });

    res.status(201).json({
      success: true,
      message: 'Document uploaded successfully',
      data: document
    });
  } catch (error) {
    console.error('Create document error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating document',
      error: error.message
    });
  }
};

// @desc    Update document metadata
// @route   PUT /api/medical-documents/:id
// @access  Private
exports.updateDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      description,
      tags,
      document_type,
      category,
      ocr_extracted_text,
      updated_by,
      ip_address
    } = req.body;

    const document = await MedicalDocument.findById(id);

    if (!document || document.is_deleted) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    // Update fields
    if (description !== undefined) document.description = description;
    if (tags) document.tags = tags;
    if (document_type) {
      document.document_type = document_type;
      document.category = category || MedicalDocument.autoCategorizeDOcument(document_type);
    }
    if (category) document.category = category;
    if (ocr_extracted_text !== undefined) document.ocr_extracted_text = ocr_extracted_text
    // Add access log
    if (updated_by) {
      await document.addAccessLog(updated_by, 'updated', ip_address);
    }

    res.status(200).json({
      success: true,
      message: 'Document updated successfully',
      data: document
    });
  } catch (error) {
    console.error('Update document error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating document',
      error: error.message
    });
  }
};

// @desc    Soft delete document
// @route   DELETE /api/medical-documents/:id
// @access  Private
exports.deleteDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const { deleted_by, ip_address } = req.query;

    const document = await MedicalDocument.findById(id);

    if (!document || document.is_deleted) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    document.is_deleted = true;
    document.is_active = false;
    await document.save();

    // Add access log
    if (deleted_by) {
      await document.addAccessLog(deleted_by, 'deleted', ip_address);
    }

    res.status(200).json({
      success: true,
      message: 'Document deleted successfully'
    });
  } catch (error) {
    console.error('Delete document error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting document',
      error: error.message
    });
  }
};

// @desc    Share document with user
// @route   POST /api/medical-documents/:id/share
// @access  Private
exports.shareDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id, user_role, permission, shared_by, ip_address } = req.body;

    const document = await MedicalDocument.findById(id);

    if (!document || document.is_deleted) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    await document.shareWithUser(user_id, user_role, permission);

    // Add access log
    if (shared_by) {
      await document.addAccessLog(shared_by, 'shared', ip_address);
    }

    res.status(200).json({
      success: true,
      message: 'Document shared successfully',
      data: document
    });
  } catch (error) {
    console.error('Share document error:', error);
    res.status(500).json({
      success: false,
      message: 'Error sharing document',
      error: error.message
    });
  }
};

// @desc    Revoke document sharing
// @route   DELETE /api/medical-documents/:id/share/:userId
// @access  Private
exports.revokeSharing = async (req, res) => {
  try {
    const { id, userId } = req.params;

    const document = await MedicalDocument.findById(id);

    if (!document || document.is_deleted) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    await document.revokeSharing(userId);

    res.status(200).json({
      success: true,
      message: 'Sharing revoked successfully'
    });
  } catch (error) {
    console.error('Revoke sharing error:', error);
    res.status(500).json({
      success: false,
      message: 'Error revoking sharing',
      error: error.message
    });
  }
};

// @desc    Get document access logs
// @route   GET /api/medical-documents/:id/access-logs
// @access  Private
exports.getAccessLogs = async (req, res) => {
  try {
    const { id } = req.params;
    const { limit = 50 } = req.query;

    const document = await MedicalDocument.findById(id).select('access_logs file_name');

    if (!document || document.is_deleted) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    const logs = document.access_logs
      .sort((a, b) => b.accessed_at - a.accessed_at)
      .slice(0, parseInt(limit));

    res.status(200).json({
      success: true,
      count: logs.length,
      file_name: document.file_name,
      data: logs
    });
  } catch (error) {
    console.error('Get access logs error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving access logs',
      error: error.message
    });
  }
};

// @desc    Create new version of document
// @route   POST /api/medical-documents/:id/version
// @access  Private
exports.createNewVersion = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      file_name,
      file_url,
      cloudinary_public_id,
      file_size,
      file_type,
      uploaded_by,
      description
    } = req.body;

    const parentDocument = await MedicalDocument.findById(id);

    if (!parentDocument || parentDocument.is_deleted) {
      return res.status(404).json({
        success: false,
        message: 'Parent document not found'
      });
    }

    // Mark old version as not latest
    parentDocument.is_latest_version = false;
    await parentDocument.save();

    // Create new version
    const newVersion = await MedicalDocument.create({
      patient_id: parentDocument.patient_id,
      uploaded_by,
      file_name,
      file_url,
      cloudinary_public_id,
      file_size,
      file_type,
      document_type: parentDocument.document_type,
      category: parentDocument.category,
      description: description || parentDocument.description,
      tags: parentDocument.tags,
      version: parentDocument.version + 1,
      parent_document_id: parentDocument._id,
      is_latest_version: true
    });

    res.status(201).json({
      success: true,
      message: 'New version created successfully',
      data: newVersion
    });
  } catch (error) {
    console.error('Create version error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating new version',
      error: error.message
    });
  }
};

// @desc    Get version history of document
// @route   GET /api/medical-documents/:id/versions
// @access  Private
exports.getVersionHistory = async (req, res) => {
  try {
    const { id } = req.params;

    const currentDocument = await MedicalDocument.findById(id);

    if (!currentDocument || currentDocument.is_deleted) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    // Find all versions (including this one and its children)
    const parentId = currentDocument.parent_document_id || currentDocument._id;
    
    const versions = await MedicalDocument.find({
      $or: [
        { _id: parentId },
        { parent_document_id: parentId }
      ],
      is_deleted: false
    }).sort({ version: -1 });

    res.status(200).json({
      success: true,
      count: versions.length,
      data: versions
    });
  } catch (error) {
    console.error('Get version history error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving version history',
      error: error.message
    });
  }
};

// @desc    Get document statistics
// @route   GET /api/medical-documents/stats/overview
// @access  Private
exports.getDocumentStats = async (req, res) => {
  try {
    const { patient_id, uploaded_by } = req.query;

    const filter = { is_deleted: false };
    if (patient_id) filter.patient_id = patient_id;
    if (uploaded_by) filter.uploaded_by = uploaded_by;

    const [total, active, typeDistribution, categoryDistribution, recentUploads] = await Promise.all([
      MedicalDocument.countDocuments(filter),
      MedicalDocument.countDocuments({ ...filter, is_active: true }),
      MedicalDocument.aggregate([
        { $match: filter },
        { $group: { _id: '$document_type', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      MedicalDocument.aggregate([
        { $match: filter },
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      MedicalDocument.countDocuments({
        ...filter,
        uploaded_at: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      })
    ]);

    res.status(200).json({
      success: true,
      data: {
        total_documents: total,
        active_documents: active,
        inactive_documents: total - active,
        recent_uploads_7days: recentUploads,
        by_document_type: typeDistribution,
        by_category: categoryDistribution
      }
    });
  } catch (error) {
    console.error('Get document stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving document statistics',
      error: error.message
    });
  }
};

// @desc    Log document download
// @route   POST /api/medical-documents/:id/download
// @access  Private
exports.logDownload = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id, ip_address } = req.body;

    const document = await MedicalDocument.findById(id);

    if (!document || document.is_deleted) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    await document.addAccessLog(user_id, 'downloaded', ip_address);

    res.status(200).json({
      success: true,
      message: 'Download logged successfully',
      download_url: document.file_url
    });
  } catch (error) {
    console.error('Log download error:', error);
    res.status(500).json({
      success: false,
      message: 'Error logging download',
      error: error.message
    });
  }
};

// @desc    Get lab reporter dashboard statistics
// @route   GET /api/medical-documents/lab-reporter-stats
// @access  Private
exports.getLabReporterStats = async (req, res) => {
  try {
    const { uploaded_by } = req.query;

    // Get total uploads
    const totalUploads = await MedicalDocument.countDocuments({
      is_deleted: false,
      ...(uploaded_by && { uploaded_by })
    });

    // Get uploads this week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const uploadsThisWeek = await MedicalDocument.countDocuments({
      is_deleted: false,
      uploaded_at: { $gte: oneWeekAgo },
      ...(uploaded_by && { uploaded_by })
    });

    // Get active documents
    const activeDocuments = await MedicalDocument.countDocuments({
      is_deleted: false,
      is_active: true,
      ...(uploaded_by && { uploaded_by })
    });

    // Get inactive reports (is_active: false)
    const inactiveReports = await MedicalDocument.countDocuments({
      is_deleted: false,
      is_active: false,
      ...(uploaded_by && { uploaded_by })
    });

    // Get recent uploads
    const recentUploads = await MedicalDocument.find({
      is_deleted: false,
      ...(uploaded_by && { uploaded_by })
    })
      .sort({ uploaded_at: -1 })
      .limit(10)
      .select('patient_id document_type file_name file_size uploaded_at is_active report_details');

    // Format recent uploads
    const formattedUploads = recentUploads.map(doc => {
      let status = 'active';
      if (!doc.is_active) status = 'inactive';
      
      return {
        id: doc._id,
        patientName: doc.patient_id,
        patientId: doc.patient_id,
        reportType: doc.document_type,
        uploadedDate: getTimeAgo(doc.uploaded_at),
        status,
        fileSize: formatFileSize(doc.file_size),
        laboratory: doc.report_details?.laboratory || 'N/A'
      };
    });

    res.status(200).json({
      success: true,
      data: {
        totalUploads,
        uploadsThisWeek,
        activeDocuments,
        inactiveReports,
        recentUploads: formattedUploads
      }
    });
  } catch (error) {
    console.error('Get lab reporter stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving statistics',
      error: error.message
    });
  }
};

// Helper function to format file size
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// Helper function to get time ago
function getTimeAgo(date) {
  const now = new Date();
  const seconds = Math.floor((now - new Date(date)) / 1000);
  
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return Math.floor(seconds / 60) + ' minutes ago';
  if (seconds < 86400) return Math.floor(seconds / 3600) + ' hours ago';
  if (seconds < 604800) return Math.floor(seconds / 86400) + ' days ago';
  return new Date(date).toLocaleDateString();
}

// @desc    Get all documents with patient details for doctors
// @route   GET /api/medical-documents/all-with-patients
// @access  Private (Doctor only)
exports.getAllDocumentsWithPatients = async (req, res) => {
  try {
    const PatientProfile = require('../models/PatientProfile');
    const {
      page = 1,
      limit = 50,
      document_type,
      category,
      search,
      sort_by = 'uploaded_at',
      sort_order = 'desc'
    } = req.query;

    // Build filter query
    const filter = { is_deleted: false, is_active: true };

    if (document_type) filter.document_type = document_type;
    if (category) filter.category = category;

    // Search in file name, description, tags
    if (search) {
      filter.$or = [
        { file_name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Pagination
    const skip = (page - 1) * limit;
    const sortOrder = sort_order === 'asc' ? 1 : -1;

    // Fetch documents
    const documents = await MedicalDocument.find(filter)
      .sort({ [sort_by]: sortOrder })
      .limit(parseInt(limit))
      .skip(skip)
      .select('-access_logs')
      .lean();

    // Get unique patient IDs
    const patientIds = [...new Set(documents.map(doc => doc.patient_id))];

    // Fetch all patient details
    const patients = await PatientProfile.find({
      $or: [
        { clerk_user_id: { $in: patientIds } },
        { _id: { $in: patientIds } }
      ]
    }).select('clerk_user_id _id name date_of_birth gender blood_group contact_number emergency_contact').lean();

    // Create a map of patient details
    const patientMap = {};
    patients.forEach(patient => {
      const key = patient.clerk_user_id || patient._id.toString();
      patientMap[key] = patient;
      // Also map by _id for fallback
      if (patient._id) {
        patientMap[patient._id.toString()] = patient;
      }
    });

    // Combine documents with patient details
    const documentsWithPatients = documents.map(doc => {
      const patientKey = doc.patient_id?.toString();
      const patient = patientMap[patientKey] || null;
      
      return {
        ...doc,
        patient: patient ? {
          _id: patient._id,
          clerk_user_id: patient.clerk_user_id,
          name: patient.name,
          date_of_birth: patient.date_of_birth,
          gender: patient.gender,
          blood_group: patient.blood_group,
          contact_number: patient.contact_number,
          age: patient.date_of_birth ? 
            Math.floor((new Date() - new Date(patient.date_of_birth)) / (365.25 * 24 * 60 * 60 * 1000)) : null
        } : null
      };
    });

    const total = await MedicalDocument.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: documentsWithPatients.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: documentsWithPatients
    });
  } catch (error) {
    console.error('Get all documents with patients error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving documents with patient details',
      error: error.message
    });
  }
};
