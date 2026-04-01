const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      default: null,
    },
    rollNumber: {
      type: String,
      required: true,
      unique: true,
    },
    department: {
      type: String,
      default: '',
    },
    year: {
      type: String,
      enum: ['1st', '2nd', '3rd', '4th'],
      default: '1st',
    },
    profileImage: {
      type: String,
      default: null,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ['student', 'admin'],
      default: 'student',
    },
    reputation: {
      type: Number,
      default: 0,
    },
    lostItemsCount: {
      type: Number,
      default: 0,
    },
    foundItemsCount: {
      type: Number,
      default: 0,
    },
    successfulReturns: {
      type: Number,
      default: 0,
    },
    successfulMatches: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    contacts: [
      {
        userId: mongoose.Schema.Types.ObjectId,
        isApproved: Boolean,
        timestamp: Date,
      },
    ],
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
