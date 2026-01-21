import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import CreateTaskModal from '../../components/task/CreateTaskModal';
import AIBreakdownModal from '../../components/task/AIBreakdownModal';
import TaskList from '../../components/task/TaskList';
import * as taskService from '../../services/taskService';
import { Plus, Loader } from 'lucide-react';

const Tasks = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [selectedTaskForAI, setSelectedTaskForAI] = useState(null);
  const [error, setError] = useState('');

  // Fetch tasks on mount
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await taskService.getTasks();
      setTasks(response.tasks);
      setError('');
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Failed to load tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      const response = await taskService.createTask(taskData);
      
      // Add new task to list
      setTasks([response.task, ...tasks]);
      
      // Return the created task (needed for AI modal)
      return response.task;
    } catch (err) {
      console.error('Error creating task:', err);
      throw err;
    }
  };

  const handleAIBreakdown = (task) => {
    // Open AI modal with the newly created task
    setSelectedTaskForAI(task);
    setAiModalOpen(true);
  };

  const handleAcceptAIBreakdown = async (breakdown) => {
    try {
      // Update task with AI breakdown
      const updatedTaskData = {
        aiGenerated: true,
        aiBreakdown: breakdown.map(item => ({
          pomodoroNumber: item.pomodoroNumber,
          subtask: item.subtask,
          steps: item.steps,
          difficulty: item.difficulty,
          completed: false,
        })),
        estimatedPomodoros: breakdown.length, // Update estimate based on AI
      };

      const response = await taskService.updateTask(selectedTaskForAI._id, updatedTaskData);
      
      // Update task in list
      setTasks(tasks.map((task) => 
        task._id === selectedTaskForAI._id ? response.task : task
      ));
      
      // Close AI modal
      setAiModalOpen(false);
      setSelectedTaskForAI(null);
    } catch (err) {
      console.error('Error updating task with AI breakdown:', err);
      alert('Failed to apply AI breakdown. Please try again.');
    }
  };

  const handleUpdateTask = async (taskId, taskData) => {
    try {
      const response = await taskService.updateTask(taskId, taskData);
      
      // Update task in list
      setTasks(tasks.map((task) => (task._id === taskId ? response.task : task)));
      
      return response;
    } catch (err) {
      console.error('Error updating task:', err);
      throw err;
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await taskService.deleteTask(taskId);
      
      // Remove task from list
      setTasks(tasks.filter((task) => task._id !== taskId));
    } catch (err) {
      console.error('Error deleting task:', err);
      alert('Failed to delete task. Please try again.');
    }
  };

  const handleSelectTask = (task) => {
    // This will be used when navigating to timer
    // The timer page will handle the selected task
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 bg-[#0a0a0a]">
        <Loader className="w-12 h-12 text-[#00ff88] animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">My Tasks</h1>
          <p className="text-[#a0a0a0]">
            Organize your work and track your progress
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Create Task
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* Total Tasks */}
        <div className="bg-[#1a1a1a] border border-[#333333] rounded-lg p-5">
          <div className="text-3xl font-bold text-white mb-1">
            {tasks.length}
          </div>
          <div className="text-sm text-[#a0a0a0]">Total Tasks</div>
        </div>

        {/* Active Tasks */}
        <div className="bg-[#1a1a1a] border border-[#333333] rounded-lg p-5">
          <div className="text-3xl font-bold text-[#00ff88] mb-1">
            {tasks.filter((task) => !task.isCompleted).length}
          </div>
          <div className="text-sm text-[#a0a0a0]">Active Tasks</div>
        </div>

        {/* Completed Tasks */}
        <div className="bg-[#1a1a1a] border border-[#333333] rounded-lg p-5">
          <div className="text-3xl font-bold text-[#00cc6a] mb-1">
            {tasks.filter((task) => task.isCompleted).length}
          </div>
          <div className="text-sm text-[#a0a0a0]">Completed Tasks</div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 mb-6">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {/* Task List */}
      <TaskList
        tasks={tasks}
        onUpdate={handleUpdateTask}
        onDelete={handleDeleteTask}
        onSelect={handleSelectTask}
        onCreateTask={() => setModalOpen(true)}
      />

      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onTaskCreated={handleCreateTask}
        onAIBreakdown={handleAIBreakdown}
      />

      {/* AI Breakdown Modal */}
      <AIBreakdownModal
        task={selectedTaskForAI}
        isOpen={aiModalOpen}
        onClose={() => {
          setAiModalOpen(false);
          setSelectedTaskForAI(null);
        }}
        onAccept={handleAcceptAIBreakdown}
      />
    </div>
  );
};

export default Tasks;