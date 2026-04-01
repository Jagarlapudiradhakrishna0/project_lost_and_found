const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: [
        'match_found',
        'contact_request',
        'contact_approved',
        'item_claimed',
        'new_lost_item',
        'new_found_item',
        'item_returned',
        'broadcast',
      ],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    itemId: mongoose.Schema.Types.ObjectId,
    matchId: mongoose.Schema.Types.ObjectId,
    relatedUserId: mongoose.Schema.Types.ObjectId,
    data: mongoose.Schema.Types.Mixed,
    isRead: {
      type: Boolean,
      default: false,
    },
    isPersonal: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);
