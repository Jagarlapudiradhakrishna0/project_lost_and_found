const express = require('express');
const router = express.Router();
const matchController = require('../controllers/matchController');
const { authenticateToken, authorizeAdmin } = require('../middleware/auth');

// Get all matches for current user
router.get('/', authenticateToken, matchController.getMyMatches);

// Find matches for a lost item
router.get('/find/:lostItemId', authenticateToken, matchController.findMatchesForLostItem);

// Create a match
router.post('/', authenticateToken, matchController.createMatch);

// Accept a match (finder confirms)
router.put('/:matchId/accept', authenticateToken, matchController.acceptMatch);

// Confirm return (loser confirms received)
router.put('/:matchId/confirm-return', authenticateToken, matchController.confirmReturn);

// Reject a match
router.put('/:matchId/reject', authenticateToken, matchController.rejectMatch);

module.exports = router;
