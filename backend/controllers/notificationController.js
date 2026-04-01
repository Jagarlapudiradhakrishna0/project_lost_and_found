const Notification = require('../models/Notification');

exports.getNotifications = async (req, res) => {
  try {
    const { isRead } = req.query;
    const filter = { userId: req.user.id };

    if (isRead !== undefined) {
      filter.isRead = isRead === 'true';
    }

    const notifications = await Notification.find(filter)
      .populate('relatedUserId', 'name email')
      .sort({ createdAt: -1 })
      .limit(50);

    const unreadCount = await Notification.countDocuments({
      userId: req.user.id,
      isRead: false,
    });

    res.json({ notifications, unreadCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const { notificationIds } = req.body;

    if (Array.isArray(notificationIds)) {
      await Notification.updateMany(
        { _id: { $in: notificationIds }, userId: req.user.id },
        { isRead: true }
      );
    } else {
      await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    }

    res.json({ message: 'Notifications marked as read' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    if (notification.userId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ error: 'Not authorized to delete this notification' });
    }

    await Notification.findByIdAndDelete(req.params.id);

    res.json({ message: 'Notification deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.broadcastNotification = async (req, res) => {
  try {
    // Only admin can broadcast
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { title, message, itemId, type } = req.body;

    // Get all active users
    const User = require('../models/User');
    const allUsers = await User.find({ isActive: true });

    // Create notification for each user
    const notifications = allUsers.map((user) => ({
      userId: user._id,
      type: type || 'broadcast',
      title,
      message,
      itemId,
      isPersonal: false,
      createdAt: new Date(),
    }));

    await Notification.insertMany(notifications);

    res.json({
      message: 'Broadcast notification sent',
      recipientsCount: allUsers.length,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
