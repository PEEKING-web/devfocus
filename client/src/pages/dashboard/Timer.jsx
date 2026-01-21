import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTimer } from '../../context/TimerContext';
import TimerDisplay from '../../components/timer/TimerDisplay';
import TimerControls from '../../components/timer/TimerControls';
import TaskSelect from '../../components/timer/TaskSelect';
import * as taskService from '../../services/taskService';
import * as sessionService from '../../services/sessionService';
import { Flame, Coffee } from 'lucide-react';
import BreakSuggestion from '../../components/timer/BreakSuggestion';
import * as notifications from '../../utils/notifications';
import SessionNotesModal from '../../components/timer/SessionNotesModal';

const Timer = () => {
  const { user, updateUser } = useAuth();
  const {
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
    clearTimerState,
  } = useTimer();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showNotesModal, setShowNotesModal] = useState(false);

  // Fetch tasks on mount
  useEffect(() => {
    fetchTasks();
    requestNotificationPermission();
  }, []);

  // Request notification permission
  const requestNotificationPermission = async () => {
    await notifications.requestPermission();
  };

  // Restore selected task from current task in timer context
    useEffect(() => {
      if (currentTask && !selectedTask) {
        setSelectedTask(currentTask);
      }
    }, [currentTask]);

    
  const fetchTasks = async () => {
    try {
      const response = await taskService.getTasks();
      setTasks(response.tasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle task selection
  const handleTaskSelect = (task) => {
    setSelectedTask(task);
    setTask(task);
  };

  // Handle start timer
  const handleStart = async () => {
    if (!selectedTask && !isBreak) {
      alert('Please select a task first!');
      return;
    }

    if (!isBreak && !currentSessionId) {
      // Create new session when starting work timer
      try {
        const response = await sessionService.createSession({
          taskId: selectedTask._id,
          duration: 25,
        });
        setSessionId(response.session._id);
        startTimer(selectedTask, response.session._id);
      } catch (error) {
        console.error('Error creating session:', error);
        alert('Failed to start session. Please try again.');
      }
    } else {
      // Resume existing session or start break
      startTimer();
    }
  };

  // Handle pause
  const handlePause = () => {
    pauseTimer();
  };

  // Handle reset
  const handleReset = () => {
    resetTimer();
  };

  // Handle skip break
  const handleSkip = () => {
    skipBreak();
  };

  // Listen for timer completion
  useEffect(() => {
    if (timeLeft === 0 && isActive) {
      handleTimerComplete();
    }
  }, [timeLeft, isActive]);

  // Handle timer completion - NOW SHOWS NOTES MODAL
  const handleTimerComplete = async () => {
    if (!isBreak && currentSessionId) {
      // Work session completed - show notes modal
      setShowNotesModal(true);
    }
  };

  // Handle saving session notes
  const handleSaveNotes = async (notes) => {
    try {
      // Complete the session with notes
      const response = await sessionService.completeSession(currentSessionId, notes);

      // Increment task Pomodoro count
      await taskService.incrementPomodoro(selectedTask._id);

      // Update user stats
      if (response.user) {
        updateUser(response.user);
      }

      // Refresh tasks to show updated progress
      fetchTasks();

      // Clear session ID
      setSessionId(null);

      // Clear timer state from localStorage
      clearTimerState();
    } catch (error) {
      console.error('Error completing session:', error);
      alert('Failed to save session. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 bg-[#0a0a0a]">
        <div className="loading-spinner w-12 h-12 border-[#00ff88]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Pomodoro Timer</h1>
        <p className="text-[#a0a0a0]">Stay focused and track your productivity</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* Today's Pomodoros */}
        <div className="bg-[#1a1a1a] border border-[#333333] rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#00ff88]/10 rounded-lg flex items-center justify-center">
              <Coffee className="w-6 h-6 text-[#00ff88]" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{sessionCount}</div>
              <div className="text-sm text-[#a0a0a0]">Today's Sessions</div>
            </div>
          </div>
        </div>

        {/* Total Pomodoros */}
        <div className="bg-[#1a1a1a] border border-[#333333] rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#00ff88]/10 rounded-lg flex items-center justify-center">
              <Flame className="w-6 h-6 text-[#00ff88]" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">
                {user?.totalPomodoros || 0}
              </div>
              <div className="text-sm text-[#a0a0a0]">Total Pomodoros</div>
            </div>
          </div>
        </div>

        {/* Current Streak */}
        <div className="bg-[#1a1a1a] border border-[#ffa116]/30 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#ffa116]/10 rounded-lg flex items-center justify-center">
              <Flame className="w-6 h-6 text-[#ffa116]" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">
                {user?.currentStreak || 0}
              </div>
              <div className="text-sm text-[#a0a0a0]">Day Streak</div>
            </div>
          </div>
        </div>
      </div>

      {/* Task Selector */}
      {!isBreak && (
        <div className="bg-[#1a1a1a] border border-[#333333] rounded-lg p-6 mb-6">
          <TaskSelect
            tasks={tasks}
            selectedTask={selectedTask}
            onSelect={handleTaskSelect}
          />
        </div>
      )}

      {/* Timer Display */}
      <div className="bg-[#1a1a1a] border border-[#333333] rounded-lg p-8 mb-6 relative overflow-hidden">
        <div 
          // className={`absolute top-0 left-0 w-full h-1 transition-colors duration-500 ${
          //   isBreak ? 'bg-[#00ff88]' : 'bg-[#00cc6a]'
          // }`}
        />
        <TimerDisplay timeLeft={timeLeft} isActive={isActive} isBreak={isBreak} />

        {/* Controls */}
        <TimerControls
          onStart={handleStart}
          onPause={handlePause}
          onReset={handleReset}
          onSkip={handleSkip}
          isActive={isActive}
          isBreak={isBreak}
        />
      </div>

      {/* Current Task Info */}
      {selectedTask && !isBreak && (
        <div className="bg-[#1a1a1a] border border-[#00ff88]/20 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-3">Working On:</h3>
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-xl font-bold text-white mb-1">
                {selectedTask.title}
              </h4>
              {selectedTask.description && (
                <p className="text-[#a0a0a0] mb-3">{selectedTask.description}</p>
              )}
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-[#00ff88]/10 text-[#00ff88] rounded-lg text-sm">
                  {selectedTask.category || 'general'}
                </span>
                <span className="text-[#6b6b6b] text-sm">
                  {selectedTask.completedPomodoros}/{selectedTask.estimatedPomodoros}{' '}
                  Pomodoros
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Break Message */}
      {isBreak && (
        <BreakSuggestion 
          sessionCount={sessionCount} 
          timeOfDay={new Date().toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
          })}
        />
      )}

      {/* Session Notes Modal */}
      <SessionNotesModal
        isOpen={showNotesModal}
        onClose={() => setShowNotesModal(false)}
        onSave={handleSaveNotes}
        taskTitle={selectedTask?.title || 'Task'}
      />
    </div>
  );
};

export default Timer;