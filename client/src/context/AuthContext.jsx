import { createContext, useContext, useState, useEffect } from 'react';
import * as authService from '../services/authService';

// Create context
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is logged in on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // Check if token exists
      if (authService.isAuthenticated()) {
        // Get user from localStorage first (instant)
        const storedUser = authService.getStoredUser();
        if (storedUser) {
          setUser(storedUser);
          setIsAuthenticated(true);
        }

        // Then verify with backend (in background)
        const response = await authService.getMe();
        setUser(response.user);
        setIsAuthenticated(true);
      }
    } catch (error) {
      // Token invalid or expired
      console.error('Auth check failed:', error);
      setUser(null);
      setIsAuthenticated(false);
      authService.logout();
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      setUser(response.user);
      setIsAuthenticated(true);
      return response;
    } catch (error) {
      throw error;
    }
  };

  // Login function
  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      setUser(response.user);
      setIsAuthenticated(true);
      return response;
    } catch (error) {
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  // Update user (after completing Pomodoro, etc.)
  const updateUser = (updatedData) => {
    setUser((prev) => ({
      ...prev,
      ...updatedData,
    }));
    // Also update localStorage
    localStorage.setItem('user', JSON.stringify({ ...user, ...updatedData }));
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    register,
    login,
    logout,
    updateUser,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export default AuthContext;