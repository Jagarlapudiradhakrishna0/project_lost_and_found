const mongoose = require('mongoose');

const foundItemSchema = new mongoose.Schema(
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
    foundDate: {
      type: Date,
      required: true,
    },
    foundTime: {
      type: String,
      default: '',
    },
    foundLocation: {
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
      enum: ['Available', 'Matched', 'Claimed'],
      default: 'Available',
    },
    isSafeWithMe: {
      type: Boolean,
      default: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    views: {
      type: Number,
      default: 0,
    },
    possibleMatches: [
      {
        lostItemId: mongoose.Schema.Types.ObjectId,
        similarity: Number,
        status: String, // 'pending', 'approved', 'rejected'
        timestamp: Date,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('FoundItem', foundItemSchema);
