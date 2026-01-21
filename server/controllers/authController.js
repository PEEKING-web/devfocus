const User = require('../models/User');
const { sendTokenResponse } = require('../utils/jwt');
const { generateOTP, sendOTPEmail } = require('../utils/emailService');

// @desc    Register new user (sends OTP)
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email and password',
      });
    }

    // ✅ Check if user already exists
    const existingUser = await User.findOne({ email }).select('+otp +otpExpires');

    if (existingUser) {
      // ✅ If user exists but NOT verified → resend OTP instead of blocking
      if (!existingUser.isVerified) {
        const otp = generateOTP();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        existingUser.otp = otp;
        existingUser.otpExpires = otpExpires;
        await existingUser.save();

        try {
          await sendOTPEmail(email, otp, existingUser.name);
        } catch (emailError) {
          return res.status(500).json({
            success: false,
            message: 'Failed to resend verification email. Please try again.',
          });
        }

        return res.status(200).json({
          success: true,
          message: 'Account exists but not verified. OTP resent to your email.',
          email: existingUser.email,
          requiresVerification: true,
        });
      }

      // ✅ If already verified → same old response
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists',
      });
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Create user (not verified yet)
    const user = await User.create({
      name,
      email,
      password,
      otp,
      otpExpires,
      isVerified: false,
    });

    // Send OTP email
    try {
      await sendOTPEmail(email, otp, name);
    } catch (emailError) {
      // If email fails, delete the user and return error
      await user.deleteOne();
      return res.status(500).json({
        success: false,
        message: 'Failed to send verification email. Please try again.',
      });
    }

    res.status(201).json({
      success: true,
      message: 'Registration successful! Check your email for verification code.',
      email: user.email,
      requiresVerification: true,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    // Validate input
    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and OTP',
      });
    }

    // Find user with OTP
    const user = await User.findOne({ email }).select('+otp +otpExpires');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check if already verified
    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email already verified. Please login.',
      });
    }

    // Check if OTP matches
    if (user.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification code',
      });
    }

    // Check if OTP expired
    if (user.otpExpires < Date.now()) {
      return res.status(400).json({
        success: false,
        message: 'Verification code expired. Please request a new one.',
      });
    }

    // Verify user
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    // Send token response
    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Resend OTP
// @route   POST /api/auth/resend-otp
// @access  Public
const resendOTP = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email',
      });
    }

    // Find user
    const user = await User.findOne({ email }).select('+otp +otpExpires');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email already verified. Please login.',
      });
    }

    // Generate new OTP
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    // Send OTP email
    await sendOTPEmail(email, otp, user.name);

    res.status(200).json({
      success: true,
      message: 'New verification code sent to your email',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    // Find user by email and include password field
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Check if email is verified
    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: 'Please verify your email before logging in',
        requiresVerification: true,
        email: user.email,
      });
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Send token response
    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    // req.user is set by protect middleware
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email',
      });
    }

    const user = await User.findOne({ email }).select('+otp +otpExpires');

    // Security: Don't reveal if user exists or not
    if (!user) {
      return res.status(200).json({
        success: true,
        message: 'If this email exists, you will receive an OTP to reset password.',
      });
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    // Send OTP email
  try {
  await sendOTPEmail(user.email, otp, user.name);
} catch (emailError) {
  console.error('❌ Forgot Password OTP email error:', emailError);

  return res.status(500).json({
    success: false,
    message: 'Failed to send OTP email. Please try again.',
  });
}

return res.status(200).json({
  success: true,
  message: 'OTP sent to your email for password reset',
  email: user.email,
});
  } catch (error) {
    next(error);
  }
};

// @desc    Verify Reset OTP
// @route   POST /api/auth/verify-reset-otp
// @access  Public
const verifyResetOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and OTP',
      });
    }

    const user = await User.findOne({ email }).select('+otp +otpExpires');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (!user.otp || !user.otpExpires) {
      return res.status(400).json({
        success: false,
        message: 'No reset OTP found. Please request a new one.',
      });
    }

    if (user.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification code',
      });
    }

    if (user.otpExpires < Date.now()) {
      return res.status(400).json({
        success: false,
        message: 'Verification code expired. Please request a new one.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'OTP verified successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset Password (after OTP verification)
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email, OTP and new password',
      });
    }

    const user = await User.findOne({ email }).select('+otp +otpExpires +password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (!user.otp || !user.otpExpires) {
      return res.status(400).json({
        success: false,
        message: 'No reset OTP found. Please request a new one.',
      });
    }

    if (user.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification code',
      });
    }

    if (user.otpExpires < Date.now()) {
      return res.status(400).json({
        success: false,
        message: 'Verification code expired. Please request a new one.',
      });
    }

    // Update password
    user.password = newPassword;

    // Clear OTP
    user.otp = undefined;
    user.otpExpires = undefined;

    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Password reset successful. Please login with your new password.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Change Password (logged in user)
// @route   POST /api/auth/change-password
// @access  Private
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current password and new password',
      });
    }

    const user = await User.findById(req.user.id).select('+password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    user.password = newPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Password updated successfully',
    });
  } catch (error) {
    next(error);
  }
};


module.exports = {
  register,
  verifyOTP,
  resendOTP,
  login,
  getMe,
  forgotPassword,
  verifyResetOTP,
  resetPassword,
  changePassword
};