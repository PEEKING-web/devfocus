import api from './api';

// Register new user
export const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    
    // Save token and user to localStorage
    if (response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    
    return response;
  } catch (error) {
    throw error;
  }
};

// Login user
export const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    
    // Save token and user to localStorage
    if (response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    
    return response;
  } catch (error) {
    throw error;
  }
};

// Get current user info
export const getMe = async () => {
  try {
    const response = await api.get('/auth/me');
    
    // Update user in localStorage
    if (response.user) {
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    
    return response;
  } catch (error) {
    throw error;
  }
};

// Logout user
export const logout = () => {
  // Clear localStorage
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  
  // Redirect to login
  window.location.href = '/login';
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token; // Returns true if token exists, false otherwise
};

// Get stored user from localStorage
export const getStoredUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

// Get token from localStorage
export const getToken = () => {
  return localStorage.getItem('token');
};

// Verify OTP
export const verifyOTP = async (data) => {
  try {
    const response = await api.post('/auth/verify-otp', data);
    
    // Save token and user to localStorage
    if (response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    
    return response;
  } catch (error) {
    throw error;
  }
};

// Resend OTP
export const resendOTP = async (data) => {
  try {
    const response = await api.post('/auth/resend-otp', data);
    return response;
  } catch (error) {
    throw error;
  }
};


// Send OTP for password reset
export const forgotPassword = async (data) => {
  try {
    // data: { email }
    const response = await api.post('/auth/forgot-password', data);
    return response;
  } catch (error) {
    throw error;
  }
};

// Verify reset OTP (optional step if you want separate screen)
export const verifyResetOTP = async (data) => {
  try {
    // data: { email, otp }
    const response = await api.post('/auth/verify-reset-otp', data);
    return response;
  } catch (error) {
    throw error;
  }
};

// Reset password using OTP
export const resetPassword = async (data) => {
  try {
    // data: { email, otp, newPassword }
    const response = await api.post('/auth/reset-password', data);
    return response;
  } catch (error) {
    throw error;
  }
};

// Change password (logged in user)
export const changePassword = async (data) => {
  try {
    // data: { currentPassword, newPassword }
    const response = await api.post('/auth/change-password', data);
    return response;
  } catch (error) {
    throw error;
  }
};
// Default export with all functions
export default {
  register,
  login,
  getMe,
  logout,
  isAuthenticated,
  getStoredUser,
  getToken,
  verifyOTP,
  resendOTP,
  forgotPassword,
  verifyResetOTP,
  resetPassword,
  changePassword,
};