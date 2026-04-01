const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { authenticateToken, authorizeAdmin } = require('../middleware/auth');

router.get('/', authenticateToken, notificationController.getNotifications);
router.put('/read/:id', authenticateToken, notificationController.markAsRead);
router.post('/read-multiple', authenticateToken, (req, res, next) => {
  req.params.id = null;
  next();
}, notificationController.markAsRead);
router.delete('/:id', authenticateToken, notificationController.deleteNotification);
router.post('/broadcast', authenticateToken, authorizeAdmin, notificationController.broadcastNotification);

module.exports = router;
