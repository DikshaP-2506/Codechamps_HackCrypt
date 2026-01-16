const Notification = require('../models/Notification');

// @desc    Get all notifications
// @route   GET /api/notifications
// @access  Public
exports.getAllNotifications = async (req, res, next) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      recipient_id, 
      patient_id, 
      notification_type,
      is_read,
      sortBy = 'sent_at', 
      order = 'desc' 
    } = req.query;

    const query = {};

    // Filter by recipient_id if provided
    if (recipient_id) {
      query.recipient_id = recipient_id;
    }

    // Filter by patient_id if provided
    if (patient_id) {
      query.patient_id = patient_id;
    }

    // Filter by notification_type if provided
    if (notification_type) {
      query.notification_type = notification_type;
    }

    // Filter by is_read if provided
    if (is_read !== undefined) {
      query.is_read = is_read === 'true';
    }

    const notifications = await Notification.find(query)
      .sort({ [sortBy]: order === 'desc' ? -1 : 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-__v');

    const count = await Notification.countDocuments(query);

    res.status(200).json({
      success: true,
      count: notifications.length,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      totalRecords: count,
      data: notifications
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get notifications by recipient ID
// @route   GET /api/notifications/recipient/:recipientId
// @access  Public
exports.getNotificationsByRecipientId = async (req, res, next) => {
  try {
    const { limit = 20, is_read } = req.query;

    const query = { recipient_id: req.params.recipientId };

    // Filter by is_read if provided
    if (is_read !== undefined) {
      query.is_read = is_read === 'true';
    }

    const notifications = await Notification.find(query)
      .sort({ sent_at: -1 })
      .limit(limit * 1)
      .select('-__v');

    res.status(200).json({
      success: true,
      count: notifications.length,
      data: notifications
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get notifications by patient ID
// @route   GET /api/notifications/patient/:patientId
// @access  Public
exports.getNotificationsByPatientId = async (req, res, next) => {
  try {
    const { limit = 20, notification_type } = req.query;

    const query = { patient_id: req.params.patientId };

    if (notification_type) {
      query.notification_type = notification_type;
    }

    const notifications = await Notification.find(query)
      .sort({ sent_at: -1 })
      .limit(limit * 1)
      .select('-__v');

    res.status(200).json({
      success: true,
      count: notifications.length,
      data: notifications
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single notification by ID
// @route   GET /api/notifications/:id
// @access  Public
exports.getNotificationById = async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id)
      .select('-__v').catch(() => null);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    res.status(200).json({
      success: true,
      data: notification
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new notification
// @route   POST /api/notifications
// @access  Public
exports.createNotification = async (req, res, next) => {
  try {
    const notification = await Notification.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Notification created successfully',
      data: notification
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update notification
// @route   PUT /api/notifications/:id
// @access  Public
exports.updateNotification = async (req, res, next) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).select('-__v');

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Notification updated successfully',
      data: notification
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Public
exports.deleteNotification = async (req, res, next) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Notification deleted successfully',
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark notification as read
// @route   PATCH /api/notifications/:id/read
// @access  Public
exports.markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      {
        is_read: true,
        read_at: new Date()
      },
      {
        new: true,
        runValidators: true
      }
    ).select('-__v');

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Notification marked as read',
      data: notification
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark all notifications as read for a recipient
// @route   PATCH /api/notifications/recipient/:recipientId/read-all
// @access  Public
exports.markAllAsRead = async (req, res, next) => {
  try {
    const result = await Notification.updateMany(
      {
        recipient_id: req.params.recipientId,
        is_read: false
      },
      {
        is_read: true,
        read_at: new Date()
      }
    );

    res.status(200).json({
      success: true,
      message: `${result.modifiedCount} notifications marked as read`,
      data: {
        modifiedCount: result.modifiedCount
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get unread count for recipient
// @route   GET /api/notifications/recipient/:recipientId/unread-count
// @access  Public
exports.getUnreadCount = async (req, res, next) => {
  try {
    const count = await Notification.countDocuments({
      recipient_id: req.params.recipientId,
      is_read: false
    });

    res.status(200).json({
      success: true,
      data: {
        unreadCount: count
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete all read notifications for recipient
// @route   DELETE /api/notifications/recipient/:recipientId/clear-read
// @access  Public
exports.clearReadNotifications = async (req, res, next) => {
  try {
    const result = await Notification.deleteMany({
      recipient_id: req.params.recipientId,
      is_read: true
    });

    res.status(200).json({
      success: true,
      message: `${result.deletedCount} notifications deleted`,
      data: {
        deletedCount: result.deletedCount
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get notification statistics
// @route   GET /api/notifications/stats/overview
// @access  Public
exports.getNotificationStats = async (req, res, next) => {
  try {
    const { recipient_id, patient_id } = req.query;

    const matchStage = {};
    if (recipient_id) matchStage.recipient_id = recipient_id;
    if (patient_id) matchStage.patient_id = patient_id;

    const stats = await Notification.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalNotifications: { $sum: 1 },
          readNotifications: {
            $sum: { $cond: [{ $eq: ['$is_read', true] }, 1, 0] }
          },
          unreadNotifications: {
            $sum: { $cond: [{ $eq: ['$is_read', false] }, 1, 0] }
          }
        }
      }
    ]);

    // Get notification type distribution
    const typeDistribution = await Notification.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$notification_type',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        overview: stats[0] || {
          totalNotifications: 0,
          readNotifications: 0,
          unreadNotifications: 0
        },
        typeDistribution: typeDistribution.map(type => ({
          type: type._id,
          count: type.count
        }))
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Send bulk notifications
// @route   POST /api/notifications/bulk
// @access  Public
exports.sendBulkNotifications = async (req, res, next) => {
  try {
    const { notifications } = req.body;

    if (!Array.isArray(notifications) || notifications.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of notifications'
      });
    }

    const createdNotifications = await Notification.insertMany(notifications);

    res.status(201).json({
      success: true,
      message: `${createdNotifications.length} notifications sent successfully`,
      data: {
        count: createdNotifications.length,
        notifications: createdNotifications
      }
    });
  } catch (error) {
    next(error);
  }
};
