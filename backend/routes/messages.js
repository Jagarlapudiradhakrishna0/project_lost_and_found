const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { authenticateToken, authorizeAdmin } = require('../middleware/auth');

router.post('/', authenticateToken, messageController.sendMessage);
router.get('/:matchId', authenticateToken, messageController.getMessages);
router.put('/approve-contact', authenticateToken, authorizeAdmin, messageController.approveContactSharing);

module.exports = router;
