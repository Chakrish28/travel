const Notification = require('../models/Notification');

const notificationController = {
  async getNotifications(req, res) {
    try {
      const notifications = await Notification.find({ userId: req.user.id })
        .sort({ createdAt: -1 })
        .limit(50);

      const unreadCount = await Notification.countDocuments({ userId: req.user.id, read: false });

      res.json({ notifications, unreadCount });
    } catch (err) {
      console.error('Get notifications error:', err);
      res.status(500).json({ error: 'Failed.' });
    }
  },

  async markAsRead(req, res) {
    try {
      const { id } = req.params;
      await Notification.findByIdAndUpdate(id, { read: true });
      res.json({ message: 'Marked as read.' });
    } catch (err) {
      console.error('Mark read error:', err);
      res.status(500).json({ error: 'Failed.' });
    }
  },

  async markAllRead(req, res) {
    try {
      await Notification.updateMany({ userId: req.user.id, read: false }, { read: true });
      res.json({ message: 'All marked as read.' });
    } catch (err) {
      console.error('Mark all read error:', err);
      res.status(500).json({ error: 'Failed.' });
    }
  }
};

module.exports = notificationController;
