import api from './api';

// Create new session (start Pomodoro)
export const createSession = async (sessionData) => {
  try {
    const response = await api.post('/sessions', sessionData);
    return response;
  } catch (error) {
    throw error;
  }
};

// Complete session
export const completeSession = async (sessionId, notes = '') => {
  try {
    const response = await api.put(`/sessions/${sessionId}/complete`, { notes });
    return response;
  } catch (error) {
    throw error;
  }
};

// Get all sessions
export const getSessions = async () => {
  try {
    const response = await api.get('/sessions');
    return response;
  } catch (error) {
    throw error;
  }
};

// Get user stats and analytics
export const getStats = async () => {
  try {
    const response = await api.get('/sessions/stats');
    return response;
  } catch (error) {
    throw error;
  }
};

// Default export with all functions
export default {
  createSession,
  completeSession,
  getSessions,
  getStats,
};