import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - attach token to every request
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    // If token exists, add to Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors globally
api.interceptors.response.use(
  (response) => {
    // If response is successful, just return the data
    return response.data;
  },
  (error) => {
    // Handle different error scenarios
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      // Unauthorized - token expired or invalid
      if (status === 401) {
        // Clear token and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      
      // Return error message from backend
      return Promise.reject(data.message || 'An error occurred');
    } else if (error.request) {
      // Request made but no response received
      return Promise.reject('Network error. Please check your connection.');
    } else {
      // Something else happened
      return Promise.reject(error.message || 'An error occurred');
    }
  }
);

export default api;