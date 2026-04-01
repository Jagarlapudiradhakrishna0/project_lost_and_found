const Match = require('../models/Match');
const LostItem = require('../models/LostItem');
const FoundItem = require('../models/FoundItem');
const User = require('../models/User');

// Get all matches for the current user
exports.getMyMatches = async (req, res) => {
  try {
    const userId = req.user.id;

    const matches = await Match.find({
      $or: [
        { lostUserId: userId },
        { foundUserId: userId },
      ],
    })
      .populate('lostItemId', 'itemName description category color lostDate lostLocation')
      .populate('foundItemId', 'itemName description category color foundDate foundLocation')
      .populate('lostUserId', 'name email phone')
      .populate('foundUserId', 'name email phone')
      .sort({ createdAt: -1 });

    res.json(matches);
  } catch (error) {
    console.error('Get matches error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Find matches for a lost item
exports.findMatchesForLostItem = async (req, res) => {
  try {
    const { lostItemId } = req.params;

    const lostItem = await LostItem.findById(lostItemId);
    if (!lostItem) {
      return res.status(404).json({ error: 'Lost item not found' });
    }

    // Find similar found items
    const foundItems = await FoundItem.find({
      status: { $ne: 'Matched' },
    });

    const matches = [];

    for (const foundItem of foundItems) {
      const { score, criteria } = calculateSimilarity(lostItem, foundItem);
      
      if (score >= 50) {
        matches.push({
          lostItemId,
          foundItemId: foundItem._id,
          lostUserId: lostItem.userId,
          foundUserId: foundItem.userId,
          similarityScore: score,
          matchingCriteria: criteria,
          status: 'pending',
        });
      }
    }

    matches.sort((a, b) => b.similarityScore - a.similarityScore);
    res.json(matches);
  } catch (error) {
    console.error('Find matches error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Create a match
exports.createMatch = async (req, res) => {
  try {
    const { lostItemId, foundItemId } = req.body;

    const existingMatch = await Match.findOne({
      lostItemId,
      foundItemId,
      status: { $ne: 'rejected' },
    });

    if (existingMatch) {
      return res.status(400).json({ error: 'Match already exists' });
    }

    const lostItem = await LostItem.findById(lostItemId);
    const foundItem = await FoundItem.findById(foundItemId);

    if (!lostItem || !foundItem) {
      return res.status(404).json({ error: 'Item not found' });
    }

    const { score, criteria } = calculateSimilarity(lostItem, foundItem);

    const match = new Match({
      lostItemId,
      foundItemId,
      lostUserId: lostItem.userId,
      foundUserId: foundItem.userId,
      similarityScore: score,
      matchingCriteria: criteria,
      status: 'pending',
    });

    await match.save();

    res.status(201).json({
      message: 'Match created successfully',
      match,
    });
  } catch (error) {
    console.error('Create match error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Accept a match (finder confirms)
exports.acceptMatch = async (req, res) => {
  try {
    const { matchId } = req.params;
    const userId = req.user.id;

    const match = await Match.findById(matchId);
    if (!match) {
      return res.status(404).json({ error: 'Match not found' });
    }

    if (match.foundUserId.toString() !== userId) {
      return res.status(403).json({ error: 'Only the finder can accept the match' });
    }

    match.status = 'contact_requested';
    await match.save();

    res.json({
      message: 'Match accepted! Contact has been initiated.',
      match,
    });
  } catch (error) {
    console.error('Accept match error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Confirm return (loser confirms they received their item)
exports.confirmReturn = async (req, res) => {
  try {
    const { matchId } = req.params;
    const userId = req.user.id;

    console.log('Confirm return request:', { matchId, userId });

    const match = await Match.findById(matchId)
      .populate('lostItemId')
      .populate('foundItemId');
    
    if (!match) {
      return res.status(404).json({ error: 'Match not found' });
    }

    console.log('Match found:', { matchId, lostUserId: match.lostUserId, userId });

    if (match.lostUserId.toString() !== userId) {
      return res.status(403).json({ error: 'Only the item loser can confirm return' });
    }

    match.status = 'completed';
    match.itemConfirmed = true;
    await match.save();

    // Update item statuses using the IDs directly
    const lostItemId = match.lostItemId._id || match.lostItemId;
    const foundItemId = match.foundItemId._id || match.foundItemId;

    console.log('Updating items:', { lostItemId, foundItemId });

    await LostItem.findByIdAndUpdate(lostItemId, { status: 'Matched' });
    await FoundItem.findByIdAndUpdate(foundItemId, { status: 'Matched' });

    // Update user stats
    const lostUserUpdate = await User.findByIdAndUpdate(match.lostUserId, { $inc: { successfulReturns: 1 } });
    const foundUserUpdate = await User.findByIdAndUpdate(match.foundUserId, { $inc: { successfulMatches: 1 } });

    console.log('User stats updated:', { lostUserUpdate, foundUserUpdate });

    res.json({
      message: 'Return confirmed! Item successfully returned.',
      match,
    });
  } catch (error) {
    console.error('Confirm return error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Reject a match
exports.rejectMatch = async (req, res) => {
  try {
    const { matchId } = req.params;
    const userId = req.user.id;

    const match = await Match.findById(matchId);
    if (!match) {
      return res.status(404).json({ error: 'Match not found' });
    }

    if (match.lostUserId.toString() !== userId && match.foundUserId.toString() !== userId) {
      return res.status(403).json({ error: 'Unauthorized to reject this match' });
    }

    match.status = 'rejected';
    await match.save();

    res.json({
      message: 'Match rejected',
      match,
    });
  } catch (error) {
    console.error('Reject match error:', error);
    res.status(500).json({ error: error.message });
  }
};

function calculateSimilarity(lostItem, foundItem) {
  let score = 0;
  const criteria = {
    category: false,
    color: false,
    location: false,
    date: false,
    description: false,
  };

  // Category match (40 points)
  if (lostItem.category === foundItem.category) {
    score += 40;
    criteria.category = true;
  }

  // Color match (20 points)
  if (
    lostItem.color &&
    foundItem.color &&
    lostItem.color.toLowerCase() === foundItem.color.toLowerCase()
  ) {
    score += 20;
    criteria.color = true;
  }

  // Location match (15 points)
  if (
    lostItem.lostLocation &&
    foundItem.foundLocation &&
    lostItem.lostLocation.toLowerCase().includes(foundItem.foundLocation.toLowerCase())
  ) {
    score += 15;
    criteria.location = true;
  }

  // Date proximity (15 points) - within 7 days
  const lostDate = new Date(lostItem.lostDate);
  const foundDate = new Date(foundItem.foundDate);
  const daysDifference = Math.abs((foundDate - lostDate) / (1000 * 60 * 60 * 24));
  
  if (daysDifference <= 7) {
    score += 15;
    criteria.date = true;
  }

  // Description similarity (10 points)
  if (
    lostItem.description &&
    foundItem.description &&
    lostItem.description.toLowerCase().includes(foundItem.description.toLowerCase())
  ) {
    score += 10;
    criteria.description = true;
  }

  return { score, criteria };
}

module.exports = exports;
