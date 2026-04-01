const DirectMessage = require('../models/DirectMessage');
const User = require('../models/User');

exports.sendDirectMessage = async (req, res) => {
  try {
    const { recipientId, itemId, itemType, message } = req.body;

    // Validation
    if (!recipientId || !itemId || !itemType || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!message.trim()) {
      return res.status(400).json({ error: 'Message cannot be empty' });
    }

    // Check if recipient exists
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ error: 'Recipient not found' });
    }

    const directMessage = new DirectMessage({
      senderId: req.user.id,
      recipientId,
      itemId,
      itemType,
      message,
    });

    await directMessage.save();
    await directMessage.populate('senderId', 'name email');
    await directMessage.populate('recipientId', 'name email');

    console.log('Direct message sent:', directMessage._id);
    res.status(201).json({
      message: 'Message sent successfully',
      data: directMessage,
    });
  } catch (error) {
    console.error('Send direct message error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getConversation = async (req, res) => {
  try {
    const { otherUserId } = req.query;

    if (!otherUserId) {
      return res.status(400).json({ error: 'otherUserId required' });
    }

    // Get all messages between these two users
    const messages = await DirectMessage.find({
      $or: [
        { senderId: req.user.id, recipientId: otherUserId },
        { senderId: otherUserId, recipientId: req.user.id },
      ],
    })
      .populate('senderId', 'name email')
      .populate('recipientId', 'name email')
      .sort({ createdAt: 1 })
      .limit(100);

    // Mark as read
    await DirectMessage.updateMany(
      {
        recipientId: req.user.id,
        senderId: otherUserId,
        isRead: false,
      },
      { isRead: true }
    );

    res.json(messages);
  } catch (error) {
    console.error('Get conversation error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getConversations = async (req, res) => {
  try {
    const mongoose = require('mongoose');
    const userId = new mongoose.Types.ObjectId(req.user.id);

    // Simplified approach: Get the latest message from each unique conversation
    const conversations = await DirectMessage.find({
      $or: [
        { senderId: userId },
        { recipientId: userId },
      ],
    })
      .populate('senderId', 'name email')
      .populate('recipientId', 'name email')
      .sort({ createdAt: -1 })
      .lean();

    // Group by conversation partners
    const conversationMap = {};
    
    conversations.forEach((msg) => {
      const otherUserId = msg.senderId._id.toString() === userId.toString() 
        ? msg.recipientId._id.toString() 
        : msg.senderId._id.toString();
      
      if (!conversationMap[otherUserId]) {
        const otherUser = msg.senderId._id.toString() === userId.toString() 
          ? msg.recipientId 
          : msg.senderId;
        
        conversationMap[otherUserId] = {
          otherUserId: otherUserId,
          _id: otherUser._id,
          otherUserName: otherUser.name,
          otherUserEmail: otherUser.email,
          lastMessage: msg.message,
          lastMessageTime: msg.createdAt,
          itemId: msg.itemId,
          itemType: msg.itemType,
          unreadCount: msg.recipientId._id.toString() === userId.toString() && !msg.isRead ? 1 : 0,
        };
      }
    });

    const result = Object.values(conversationMap).sort((a, b) => 
      new Date(b.lastMessageTime) - new Date(a.lastMessageTime)
    );

    res.json(result);
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ error: error.message });
  }
};
