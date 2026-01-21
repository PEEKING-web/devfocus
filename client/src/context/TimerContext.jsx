import { createContext, useContext, useState, useEffect, useRef } from 'react';
import * as notifications from '../utils/notifications';

// Create context
const TimerContext = createContext();

// LocalStorage keys
const TIMER_STORAGE_KEY = 'devfocus_timer_state';

// Provider component
export const TimerProvider = ({ children }) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [sessionCount, setSessionCount] = useState(0);
  const [currentSessionId, setCurrentSessionId] = useState(null);

  const intervalRef = useRef(null);

  // Load timer state from localStorage on mount
  useEffect(() => {
    loadTimerState();
  }, []);

  // Save timer state to localStorage whenever it changes
  useEffect(() => {
    if (isActive || currentSessionId) {
      saveTimerState();
    }
  }, [timeLeft, isActive, isBreak, currentTask, sessionCount, currentSessionId]);

// Load timer state from localStorage
const loadTimerState = () => {
  try {
    const saved = localStorage.getItem(TIMER_STORAGE_KEY);
    if (saved) {
      const state = JSON.parse(saved);
      
      // Only restore if session was active recently (within last hour)
      const savedTime = new Date(state.savedAt);
      const now = new Date();
      const hoursPassed = (now - savedTime) / (1000 * 60 * 60);
      
      if (hoursPassed < 1) {
        // Calculate time elapsed since save
        const secondsPassed = Math.floor((now - savedTime) / 1000);
        
        // IMPORTANT: Only subtract time if timer was active
        const newTimeLeft = state.isActive 
          ? Math.max(0, state.timeLeft - secondsPassed)
          : state.timeLeft;
        
        setTimeLeft(newTimeLeft);
        setIsActive(state.isActive && newTimeLeft > 0);
        setIsBreak(state.isBreak); // ← THIS FIXES THE BREAK MODE RESET!
        setCurrentTask(state.currentTask);
        setSessionCount(state.sessionCount);
        setCurrentSessionId(state.currentSessionId);
        
        console.log(`✅ Timer restored: ${state.isBreak ? 'BREAK' : 'WORK'} mode, ${newTimeLeft}s remaining`);
      } else {
        // Clear old state
        clearTimerState();
      }
    }
  } catch (error) {
    console.error('Error loading timer state:', error);
  }
};

  // Save timer state to localStorage
  const saveTimerState = () => {
    try {
      const state = {
        timeLeft,
        isActive,
        isBreak,
        currentTask,
        sessionCount,
        currentSessionId,
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem(TIMER_STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Error saving timer state:', error);
    }
  };

  // Clear timer state from localStorage
  const clearTimerState = () => {
    try {
      localStorage.removeItem(TIMER_STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing timer state:', error);
    }
  };

  // Countdown logic
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, timeLeft]);

  // Check if timer completed
  useEffect(() => {
    if (timeLeft === 0 && isActive) {
      handleTimerComplete();
    }
  }, [timeLeft, isActive]);

  // Handle timer completion
  const handleTimerComplete = () => {
    setIsActive(false);

    if (!isBreak) {
      // Work session complete - start break
      setIsBreak(true);
      setTimeLeft(5 * 60);
      setSessionCount((prev) => prev + 1);
      
      // Play notification sound
      notifications.playNotificationSound();
      
      // Show browser notification
      notifications.showNotification('Pomodoro Complete! 🎉', {
        body: 'Great work! Time for a 5-minute break.',
        tag: 'pomodoro-complete',
      });
    } else {
      // Break complete - ready for next work session
      setIsBreak(false);
      setTimeLeft(25 * 60);
      
      // Clear timer state after break
      clearTimerState();
      
      // Show browser notification
      notifications.showNotification('Break Over! 💪', {
        body: 'Ready to focus again?',
        tag: 'break-complete',
      });
    }
  };

  // Start timer
  const startTimer = (task = null, sessionId = null) => {
    setIsActive(true);
    if (task) {
      setCurrentTask(task);
    }
    if (sessionId) {
      setCurrentSessionId(sessionId);
    }
  };

  // Pause timer
  const pauseTimer = () => {
    setIsActive(false);
  };

  // Reset timer
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(isBreak ? 5 * 60 : 25 * 60);
    clearTimerState();
  };

  // Skip break
  const skipBreak = () => {
    setIsBreak(false);
    setTimeLeft(25 * 60);
    setIsActive(false);
    clearTimerState();
  };

  // Set task
  const setTask = (task) => {
    setCurrentTask(task);
  };

  // Set session ID
  const setSessionId = (id) => {
    setCurrentSessionId(id);
  };

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const value = {
    timeLeft,
    isActive,
    isBreak,
    currentTask,
    sessionCount,
    currentSessionId,
    startTimer,
    pauseTimer,
    resetTimer,
    skipBreak,
    setTask,
    setSessionId,
    formatTime,
    clearTimerState,
  };

  return <TimerContext.Provider value={value}>{children}</TimerContext.Provider>;
};

// Custom hook to use timer context
export const useTimer = () => {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error('useTimer must be used within TimerProvider');
  }
  return context;
};

export default TimerContext;