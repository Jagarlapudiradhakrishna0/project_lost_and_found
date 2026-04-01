const mongoose = require('mongoose');

const directMessageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    itemType: {
      type: String,
      enum: ['lost', 'found'],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Index for faster queries
directMessageSchema.index({ senderId: 1, recipientId: 1 });
directMessageSchema.index({ recipientId: 1, isRead: 1 });

module.exports = mongoose.model('DirectMessage', directMessageSchema);
