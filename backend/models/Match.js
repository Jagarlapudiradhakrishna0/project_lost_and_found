const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema(
  {
    lostItemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LostItem',
      required: true,
    },
    foundItemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FoundItem',
      required: true,
    },
    lostUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    foundUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    similarityScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    matchingCriteria: {
      category: Boolean,
      color: Boolean,
      location: Boolean,
      date: Boolean,
      description: Boolean,
    },
    status: {
      type: String,
      enum: [
        'pending',
        'admin_review',
        'contact_requested',
        'in_contact',
        'completed',
        'rejected',
      ],
      default: 'pending',
    },
    adminVerified: {
      type: Boolean,
      default: false,
    },
    adminVerifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    contactApproved: {
      type: Boolean,
      default: false,
    },
    itemConfirmed: {
      type: Boolean,
      default: false,
    },
    notes: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Match', matchSchema);
