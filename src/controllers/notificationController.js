const { Notification } = require('../models/notificationModel');
const { ErrorResponse } = require('../utils/errorUtils');

exports.getNotifications = async (req, res, next) => {
  const { userId } = req;

  try {
    const notifications = await Notification.findAll({ where: { userId } });
    res.status(200).json(notifications);
  } catch (error) {
    next(error);
  }
};

exports.markNotificationsAsRead = async (req, res, next) => {
  const { userId } = req;

  try {
    await Notification.update({ isRead: true }, { where: { userId } });
    res.status(200).json({ message: 'Notifications marked as read' });
  } catch (error) {
    next(error);
  }
};