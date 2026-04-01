const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateToken, authorizeAdmin } = require('../middleware/auth');

router.get('/dashboard/stats', authenticateToken, authorizeAdmin, adminController.getDashboardStats);
router.get('/items/pending', authenticateToken, authorizeAdmin, adminController.getPendingItems);
router.put('/items/verify', authenticateToken, authorizeAdmin, adminController.verifyItem);
router.put('/items/reject', authenticateToken, authorizeAdmin, adminController.rejectItem);
router.get('/matches/pending', authenticateToken, authorizeAdmin, adminController.getPendingMatches);
router.put('/matches/:matchId/approve', authenticateToken, authorizeAdmin, adminController.approveMatchAsAdmin);
router.put('/matches/:matchId/reject', authenticateToken, authorizeAdmin, adminController.rejectMatchAsAdmin);
router.get('/users', authenticateToken, authorizeAdmin, adminController.getAllUsers);
router.put('/users/:userId/suspend', authenticateToken, authorizeAdmin, adminController.suspendUser);
router.put('/users/:userId/activate', authenticateToken, authorizeAdmin, adminController.activateUser);
router.post('/clear-database', authenticateToken, authorizeAdmin, adminController.clearDatabase);

module.exports = router;
