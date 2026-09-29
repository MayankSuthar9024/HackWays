const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Rate limiting for OTP generation
const otpLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 10, // max 10 requests per window
  message: { success: false, message: 'Too many OTP requests from this IP, please try again after 5 minutes.' },
});

router.post('/send-otp', otpLimiter, authController.sendOTP);
router.post('/verify-otp', authController.verifyOTP);
router.post('/admin-login', authController.adminLogin);
router.get('/me', protect, authController.getMe);
router.put('/profile', protect, authController.updateProfile);

module.exports = router;
