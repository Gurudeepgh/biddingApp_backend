const express = require('express');
const { authenticateToken } = require('../middlewares/authMiddleware');
const {
  getNotifications,
  markNotificationsAsRead,
} = require('../controllers/notificationController');

const router = express.Router();

router.get('/', authenticateToken, getNotifications);
router.post('/mark-read', authenticateToken, markNotificationsAsRead);

module.exports = router;