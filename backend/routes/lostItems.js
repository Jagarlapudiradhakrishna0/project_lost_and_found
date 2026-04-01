const express = require('express');
const router = express.Router();
const lostItemController = require('../controllers/lostItemController');
const { authenticateToken } = require('../middleware/auth');

router.post('/', authenticateToken, lostItemController.reportLostItem);
router.get('/', lostItemController.getLostItems);
router.get('/:id', lostItemController.getLostItemById);
router.put('/:id', authenticateToken, lostItemController.updateLostItem);
router.delete('/:id', authenticateToken, lostItemController.deleteLostItem);
router.put('/:id/mark-received', authenticateToken, lostItemController.markAsReceived);

module.exports = router;
