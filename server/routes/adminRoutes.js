const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, requireAdmin } = require('../middleware/auth');

// All admin routes require token and admin role
router.use(protect, requireAdmin);

router.get('/dashboard', adminController.getDashboardStats);
router.get('/users', adminController.getRegisteredUsers);
router.get('/submissions', adminController.getSubmissions);
router.put('/submissions/:type/:id/review', adminController.updateSubmissionStatus);
router.get('/admins', adminController.getAdmins);
router.post('/admins', adminController.createAdmin);

module.exports = router;
