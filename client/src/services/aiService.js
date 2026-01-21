import api from './api';

// Get AI-powered task breakdown
export const breakdownTask = async (taskData) => {
  try {
    const response = await api.post('/ai/breakdown', {
      title: taskData.title,
      description: taskData.description || '',
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// Get AI-powered break suggestion
export const suggestBreak = async (sessionCount, timeOfDay) => {
  try {
    const response = await api.post('/ai/suggest-break', {
      sessionCount: sessionCount || 1,
      timeOfDay: timeOfDay || new Date().toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
      }),
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// Default export with all functions
export default {
  breakdownTask,
  suggestBreak,
};