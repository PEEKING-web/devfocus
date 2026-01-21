import { useState } from 'react';
import { X, Plus, Sparkles } from 'lucide-react';

const CreateTaskModal = ({ isOpen, onClose, onTaskCreated, onAIBreakdown }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'medium',
    estimatedPomodoros: 1,
    useAI: false, // NEW: AI breakdown checkbox
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { title, description, category, priority, estimatedPomodoros, useAI } = formData;

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!title.trim()) {
      setError('Please enter a task title');
      return;
    }

    if (estimatedPomodoros < 1) {
      setError('Estimated Pomodoros must be at least 1');
      return;
    }

    setLoading(true);

    try {
      // Create the task first
      const createdTask = await onTaskCreated({
        title,
        description,
        category,
        priority,
        estimatedPomodoros,
      });
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        category: '',
        priority: 'medium',
        estimatedPomodoros: 1,
        useAI: false,
      });
      
      // If AI breakdown requested, trigger AI modal
      if (useAI && onAIBreakdown) {
        onAIBreakdown(createdTask);
      }
      
      onClose();
    } catch (err) {
      setError(err || 'Failed to create task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        title: '',
        description: '',
        category: '',
        priority: 'medium',
        estimatedPomodoros: 1,
        useAI: false,
      });
      setError('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      {/* Modal - Re-themed to LeetCode Deep Black */}
      <div className="bg-[#1a1a1a] border border-[#333333] rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#333333]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#00ff88]/10 rounded-lg flex items-center justify-center border border-[#00ff88]/20">
              <Plus className="w-6 h-6 text-[#00ff88]" />
            </div>
            <h2 className="text-2xl font-bold text-white">Create New Task</h2>
          </div>
          <button
            onClick={handleClose}
            className="text-[#6b6b6b] hover:text-white transition-colors"
            disabled={loading}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-[#a0a0a0] mb-2">
              Task Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={title}
              onChange={handleChange}
              className="w-full bg-[#2c2c2c] border border-[#444444] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#00ff88] transition-colors"
              placeholder="e.g., Build authentication system"
              disabled={loading}
              autoFocus
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-[#a0a0a0] mb-2">
              Description (Optional)
            </label>
            <textarea
              id="description"
              name="description"
              value={description}
              onChange={handleChange}
              className="w-full bg-[#2c2c2c] border border-[#444444] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#00ff88] transition-colors min-h-[100px] resize-none"
              placeholder="Add more details about this task..."
              disabled={loading}
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-[#a0a0a0] mb-2">
              Category
            </label>
            <input
              type="text"
              id="category"
              name="category"
              value={category}
              onChange={handleChange}
              className="w-full bg-[#2c2c2c] border border-[#444444] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#00ff88] transition-colors"
              placeholder="e.g., frontend, backend, design"
              disabled={loading}
            />
          </div>

          {/* Priority & Estimated Pomodoros Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Priority */}
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-[#a0a0a0] mb-2">
                Priority
              </label>
              <select
                id="priority"
                name="priority"
                value={priority}
                onChange={handleChange}
                className="w-full bg-[#2c2c2c] border border-[#444444] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#00ff88] transition-colors"
                disabled={loading}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            {/* Estimated Pomodoros */}
            <div>
              <label htmlFor="estimatedPomodoros" className="block text-sm font-medium text-[#a0a0a0] mb-2">
                Estimated Pomodoros
              </label>
              <input
                type="number"
                id="estimatedPomodoros"
                name="estimatedPomodoros"
                value={estimatedPomodoros}
                onChange={handleChange}
                className="w-full bg-[#2c2c2c] border border-[#444444] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#00ff88] transition-colors"
                min="1"
                max="50"
                disabled={loading}
              />
            </div>
          </div>

          {/* AI Breakdown Checkbox - UPDATED TO GREEN */}
          <div className="bg-[#00ff88]/5 border border-[#00ff88]/20 rounded-lg p-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="useAI"
                checked={useAI}
                onChange={handleChange}
                disabled={loading}
                className="mt-1 w-4 h-4 text-[#00ff88] bg-[#0a0a0a] border-[#444444] rounded focus:ring-[#00ff88] focus:ring-offset-0"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-[#00ff88]" />
                  <span className="text-sm font-medium text-[#00ff88]">
                    Use AI Breakdown
                  </span>
                </div>
                <p className="text-xs text-[#a0a0a0]">
                  Let Claude AI automatically break down this task into focused 25-minute Pomodoro sessions with detailed steps.
                </p>
              </div>
            </label>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 bg-[#333333] hover:bg-[#444444] text-white rounded-lg transition-colors border border-[#444444]"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-[#00ff88] hover:bg-[#00cc6a] text-black font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="loading-spinner w-5 h-5 border-black/30 border-t-black"></div>
                  Creating...
                </span>
              ) : (
                <>
                  {useAI ? 'Create & Get AI Breakdown' : 'Create Task'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTaskModal;