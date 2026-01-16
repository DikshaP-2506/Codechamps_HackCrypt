const express = require('express');
const router = express.Router();
const {
  getAllNotifications,
  getNotificationsByRecipientId,
  getNotificationsByPatientId,
  getNotificationById,
  createNotification,
  updateNotification,
  deleteNotification,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
  clearReadNotifications,
  getNotificationStats,
  sendBulkNotifications
} = require('../controllers/notificationController');
const { validateNotification } = require('../middleware/validators');

// Statistics route (must be before /:id)
router.get('/stats/overview', getNotificationStats);

// Bulk operations
router.post('/bulk', sendBulkNotifications);

// Main routes
router.route('/')
  .get(getAllNotifications)
  .post(validateNotification, createNotification);

router.route('/:id')
  .get(getNotificationById)
  .put(validateNotification, updateNotification)
  .delete(deleteNotification);

// Mark as read
router.patch('/:id/read', markAsRead);

// Recipient-specific routes
router.get('/recipient/:recipientId', getNotificationsByRecipientId);
router.get('/recipient/:recipientId/unread-count', getUnreadCount);
router.patch('/recipient/:recipientId/read-all', markAllAsRead);
router.delete('/recipient/:recipientId/clear-read', clearReadNotifications);

// Patient-specific routes
router.get('/patient/:patientId', getNotificationsByPatientId);

module.exports = router;
