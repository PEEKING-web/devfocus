const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE,
    }
  );
};

// Send token response (token + user data)
const sendTokenResponse = (user, statusCode, res) => {
  // Generate token
  const token = generateToken(user._id);

  // Remove password from user object
  const userObject = user.toObject();
  delete userObject.password;

  res.status(statusCode).json({
    success: true,
    token,
    user: userObject,
  });
};

module.exports = {
  generateToken,
  sendTokenResponse,
};