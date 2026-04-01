const LostItem = require('../models/LostItem');
const FoundItem = require('../models/FoundItem');
const Match = require('../models/Match');
const User = require('../models/User');

exports.getDashboardStats = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const [
      totalUsers,
      totalLostItems,
      totalFoundItems,
      totalMatches,
      successfulReturns,
      pendingVerification,
    ] = await Promise.all([
      User.countDocuments(),
      LostItem.countDocuments(),
      FoundItem.countDocuments(),
      Match.countDocuments(),
      Match.countDocuments({ status: 'completed' }),
      Match.countDocuments({ status: 'pending' }),
    ]);

    res.json({
      totalUsers,
      totalLostItems,
      totalFoundItems,
      totalMatches,
      successfulReturns,
      pendingVerification,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPendingItems = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const lostItems = await LostItem.find({ isVerified: false })
      .populate('userId', 'name email')
      .limit(20);

    const foundItems = await FoundItem.find({ isVerified: false })
      .populate('userId', 'name email')
      .limit(20);

    res.json({ lostItems, foundItems });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.verifyItem = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { itemId, itemType } = req.body;

    if (itemType === 'lost') {
      const item = await LostItem.findByIdAndUpdate(
        itemId,
        { isVerified: true },
        { new: true }
      );
      res.json({ message: 'Lost item verified', item });
    } else if (itemType === 'found') {
      const item = await FoundItem.findByIdAndUpdate(
        itemId,
        { isVerified: true },
        { new: true }
      );
      res.json({ message: 'Found item verified', item });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.rejectItem = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { itemId, itemType, reason } = req.body;

    if (itemType === 'lost') {
      await LostItem.findByIdAndDelete(itemId);
    } else if (itemType === 'found') {
      await FoundItem.findByIdAndDelete(itemId);
    }

    res.json({ message: 'Item rejected and removed' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPendingMatches = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const matches = await Match.find({
      status: { $in: ['pending', 'admin_review'] },
    })
      .populate('lostItemId')
      .populate('foundItemId')
      .populate('lostUserId', 'name email')
      .populate('foundUserId', 'name email')
      .limit(20);

    res.json(matches);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.approveMatchAsAdmin = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const matchId = req.params.matchId;

    const match = await Match.findByIdAndUpdate(
      matchId,
      { adminVerified: true, adminVerifiedBy: req.user.id, status: 'contact_requested' },
      { new: true }
    );

    res.json({
      message: 'Match approved by admin',
      match,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.rejectMatchAsAdmin = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { matchId } = req.params;
    const { reason } = req.body;

    const match = await Match.findByIdAndUpdate(
      matchId,
      { status: 'rejected' },
      { new: true }
    );

    res.json({
      message: 'Match rejected',
      match,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(100);

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.suspendUser = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const userId = req.params.userId;

    const user = await User.findByIdAndUpdate(
      userId,
      { isActive: false },
      { new: true }
    ).select('-password');

    res.json({
      message: 'User suspended',
      user,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.activateUser = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const userId = req.params.userId;

    const user = await User.findByIdAndUpdate(
      userId,
      { isActive: true },
      { new: true }
    ).select('-password');

    res.json({
      message: 'User activated',
      user,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.clearDatabase = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    // Delete all items and matches
    const lostDeleted = await LostItem.deleteMany({});
    const foundDeleted = await FoundItem.deleteMany({});
    const matchesDeleted = await Match.deleteMany({});

    res.json({
      message: 'Database cleared successfully',
      deleted: {
        lostItems: lostDeleted.deletedCount,
        foundItems: foundDeleted.deletedCount,
        matches: matchesDeleted.deletedCount,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
