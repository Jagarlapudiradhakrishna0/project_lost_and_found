const express = require('express');
const router = express.Router();
const directMessageController = require('../controllers/directMessageController');
const { authenticateToken } = require('../middleware/auth');

// Send a direct message
router.post('/', authenticateToken, directMessageController.sendDirectMessage);

// Get conversation with a specific user
router.get('/conversation', authenticateToken, directMessageController.getConversation);

// Get all conversations for the user
router.get('/', authenticateToken, directMessageController.getConversations);

module.exports = router;
