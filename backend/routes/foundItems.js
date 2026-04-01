const express = require('express');
const router = express.Router();
const foundItemController = require('../controllers/foundItemController');
const { authenticateToken } = require('../middleware/auth');

router.post('/', authenticateToken, foundItemController.reportFoundItem);
router.get('/', foundItemController.getFoundItems);
router.get('/:id', foundItemController.getFoundItemById);
router.put('/:id', authenticateToken, foundItemController.updateFoundItem);
router.delete('/:id', authenticateToken, foundItemController.deleteFoundItem);
router.put('/:id/mark-received', authenticateToken, foundItemController.markAsReceived);

module.exports = router;
