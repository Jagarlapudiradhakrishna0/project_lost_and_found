const mongoose = require('mongoose');

const lostItemSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    itemName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: [
        'Phone',
        'Wallet',
        'ID Card',
        'Laptop',
        'Headphones',
        'Watch',
        'Bag',
        'Keys',
        'Books',
        'Other',
      ],
      required: true,
    },
    color: {
      type: String,
      default: '',
    },
    lostDate: {
      type: Date,
      required: true,
    },
    lostTime: {
      type: String,
      default: '',
    },
    lostLocation: {
      type: String,
      required: true,
    },
    locationCoordinates: {
      latitude: Number,
      longitude: Number,
    },
    images: [
      {
        url: String,
        publicId: String,
      },
    ],
    status: {
      type: String,
      enum: ['Lost', 'Matched', 'Returned'],
      default: 'Lost',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    reward: {
      offered: Boolean,
      amount: Number,
      description: String,
    },
    views: {
      type: Number,
      default: 0,
    },
    matches: [
      {
        foundItemId: mongoose.Schema.Types.ObjectId,
        similarity: Number,
        status: String, // 'pending', 'approved', 'rejected'
        timestamp: Date,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('LostItem', lostItemSchema);
