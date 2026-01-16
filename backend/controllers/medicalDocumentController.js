const MedicalDocument = require('../models/MedicalDocument');
const { uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');

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

// @desc    Get documents by patient ID
// @route   GET /api/medical-documents/patient/:patientId
// @access  Private
exports.getDocumentsByPatientId = async (req, res) => {
  try {
    const { patientId } = req.params;
    const { document_type, category, limit = 50 } = req.query;

    const filter = {
      patient_id: patientId,
      is_deleted: false,
      is_active: true
    };

    if (document_type) filter.document_type = document_type;
    if (category) filter.category = category;

    const documents = await MedicalDocument.find(filter)
      .sort({ uploaded_at: -1 })
      .limit(parseInt(limit))
      .select('-access_logs');

    res.status(200).json({
      success: true,
      count: documents.length,
      patient_id: patientId,
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
        tags = []
      } = req.body;

      // Auto-categorize document
      const category = MedicalDocument.autoCategorizeDOcument(document_type);

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
        ai_detected_conditions: [],
        is_ai_verified: false
      });

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
      ocr_extracted_text,
      ai_detected_conditions
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
      ocr_extracted_text: ocr_extracted_text || '',
      ai_detected_conditions: ai_detected_conditions || [],
      is_ai_verified: !!ai_detected_conditions?.length
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
      ai_detected_conditions,
      is_ai_verified,
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
    if (ocr_extracted_text !== undefined) document.ocr_extracted_text = ocr_extracted_text;
    if (ai_detected_conditions) document.ai_detected_conditions = ai_detected_conditions;
    if (is_ai_verified !== undefined) document.is_ai_verified = is_ai_verified;

    await document.save();

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
