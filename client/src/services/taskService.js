import api from './api';

// Create new task
export const createTask = async (taskData) => {
  try {
    const response = await api.post('/tasks', taskData);
    return response;
  } catch (error) {
    throw error;
  }
};

// Get all tasks
export const getTasks = async () => {
  try {
    const response = await api.get('/tasks');
    return response;
  } catch (error) {
    throw error;
  }
};

// Get single task by ID
export const getTask = async (taskId) => {
  try {
    const response = await api.get(`/tasks/${taskId}`);
    return response;
  } catch (error) {
    throw error;
  }
};

// Update task
export const updateTask = async (taskId, taskData) => {
  try {
    const response = await api.put(`/tasks/${taskId}`, taskData);
    return response;
  } catch (error) {
    throw error;
  }
};

// Delete task
export const deleteTask = async (taskId) => {
  try {
    const response = await api.delete(`/tasks/${taskId}`);
    return response;
  } catch (error) {
    throw error;
  }
};

// Increment task Pomodoro count
export const incrementPomodoro = async (taskId) => {
  try {
    const response = await api.put(`/tasks/${taskId}/increment`);
    return response;
  } catch (error) {
    throw error;
  }
};

// Default export with all functions
export default {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
  incrementPomodoro,
};