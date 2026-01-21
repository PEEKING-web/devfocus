const express = require('express');
const {
  register,
  login,
  getMe,
  verifyOTP,
  resendOTP,

  //(Forgot/Reset/Change password)
  forgotPassword,
  verifyResetOTP,
  resetPassword,
  changePassword,
} = require('../controllers/authController');

const { protect } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);
router.post('/login', login);

//Forgot Password Flow (Public)
router.post('/forgot-password', forgotPassword);
router.post('/verify-reset-otp', verifyResetOTP);
router.post('/reset-password', resetPassword);

// Protected routes
router.get('/me', protect, getMe);

//Change Password (Protected)
router.post('/change-password', protect, changePassword);

module.exports = router;
