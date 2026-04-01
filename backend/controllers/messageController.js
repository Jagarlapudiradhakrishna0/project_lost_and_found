const Message = require('../models/Message');
const Match = require('../models/Match');
const Notification = require('../models/Notification');

exports.sendMessage = async (req, res) => {
  try {
    const { matchId, message, messageType, contactInfo } = req.body;

    const match = await Match.findById(matchId);
    if (!match) {
      return res.status(404).json({ error: 'Match not found' });
    }

    // Determine recipient based on who's sending
    let recipientId;
    if (match.lostUserId.toString() === req.user.id) {
      recipientId = match.foundUserId;
    } else if (match.foundUserId.toString() === req.user.id) {
      recipientId = match.lostUserId;
    } else {
      return res
        .status(403)
        .json({ error: 'Not authorized to message in this match' });
    }

    const newMessage = new Message({
      matchId,
      senderId: req.user.id,
      recipientId,
      message,
      messageType,
      contactInfo: messageType === 'contact_shared' ? contactInfo : null,
    });

    await newMessage.save();

    // Create notification
    await Notification.create({
      userId: recipientId,
      type:
        messageType === 'contact_request'
          ? 'contact_request'
          : 'match_found',
      title:
        messageType === 'contact_request'
          ? 'Contact Request'
          : 'New Message',
      message,
      matchId,
      relatedUserId: req.user.id,
      isPersonal: true,
    });

    res.status(201).json({
      message: 'Message sent successfully',
      newMessage,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const matchId = req.params.matchId;

    const match = await Match.findById(matchId);
    if (!match) {
      return res.status(404).json({ error: 'Match not found' });
    }

    // Check authorization
    if (
      match.lostUserId.toString() !== req.user.id &&
      match.foundUserId.toString() !== req.user.id
    ) {
      return res
        .status(403)
        .json({ error: 'Not authorized to view these messages' });
    }

    const messages = await Message.find({ matchId })
      .populate('senderId', 'name email phone')
      .sort({ createdAt: 1 });

    // Mark messages as read
    await Message.updateMany(
      { matchId, recipientId: req.user.id, isRead: false },
      { isRead: true }
    );

    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.approveContactSharing = async (req, res) => {
  try {
    const { matchId } = req.body;

    const match = await Match.findById(matchId);
    if (!match) {
      return res.status(404).json({ error: 'Match not found' });
    }

    // Only admin can approve
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    match.contactApproved = true;
    await match.save();

    // Notify both users
    const notificationData = {
      type: 'contact_approved',
      title: 'Contact Access Approved',
      message: 'Admin has approved contact sharing for this match',
      matchId,
      isPersonal: true,
    };

    await Promise.all([
      Notification.create({
        ...notificationData,
        userId: match.lostUserId,
        relatedUserId: match.foundUserId,
      }),
      Notification.create({
        ...notificationData,
        userId: match.foundUserId,
        relatedUserId: match.lostUserId,
      }),
    ]);

    res.json({
      message: 'Contact sharing approved',
      match,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
