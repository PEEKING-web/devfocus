import { Play, Trash2, CheckCircle2, Circle, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const TaskCard = ({ task, onUpdate, onDelete, onSelect }) => {
  const navigate = useNavigate();
  const [showFullBreakdown, setShowFullBreakdown] = useState(false);

  // Logic preserved: Priority colors updated to match LeetCode theme
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/10 text-red-400 border-red-500/50';
      case 'medium':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/50';
      case 'low':
        return 'bg-[#00ff88]/10 text-[#00ff88] border-[#00ff88]/50';
      default:
        return 'bg-[#333333] text-[#a0a0a0] border-[#444444]';
    }
  };

  // Logic preserved: Difficulty colors
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 1:
        return 'text-[#00ff88]';
      case 2:
        return 'text-[#ffa116]';
      case 3:
        return 'text-red-500';
      default:
        return 'text-[#6b6b6b]';
    }
  };

  // Logic preserved: Difficulty labels
  const getDifficultyLabel = (difficulty) => {
    switch (difficulty) {
      case 1:
        return '●';
      case 2:
        return '●●';
      case 3:
        return '●●●';
      default:
        return '';
    }
  };

  const progressPercentage = (task.completedPomodoros / task.estimatedPomodoros) * 100;

  const handleStartTimer = () => {
    if (onSelect) {
      onSelect(task);
    }
    navigate('/dashboard/timer');
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${task.title}"?`)) {
      onDelete(task._id);
    }
  };

  return (
    <div className="bg-[#1a1a1a] rounded-lg p-5 border border-[#333333] hover:border-[#444444] transition-all group">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {/* Completion Icon */}
            {task.isCompleted ? (
              <CheckCircle2 className="w-5 h-5 text-[#00ff88]" />
            ) : (
              <Circle className="w-5 h-5 text-[#6b6b6b]" />
            )}

            {/* Title */}
            <h3
              className={`text-lg font-semibold ${
                task.isCompleted ? 'text-[#6b6b6b] line-through' : 'text-white'
              }`}
            >
              {task.title}
            </h3>

            {/* AI Badge - Re-themed to green/black */}
            {task.aiGenerated && (
              <span className="flex items-center gap-1 px-2 py-0.5 bg-[#00ff88]/10 text-[#00ff88] rounded-lg text-xs border border-[#00ff88]/30">
                <Sparkles className="w-3 h-3" />
                AI
              </span>
            )}
          </div>

          {/* Description */}
          {task.description && (
            <p className="text-sm text-[#a0a0a0] mb-3 line-clamp-2">{task.description}</p>
          )}

          {/* Tags Row */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Category */}
            {task.category && (
              <span className="px-2 py-1 bg-[#333333] text-[#d1d1d1] rounded text-xs border border-[#444444]">
                {task.category}
              </span>
            )}

            {/* Priority */}
            <span className={`px-2 py-1 rounded text-xs font-medium border ${getPriorityColor(task.priority)}`}>
              {task.priority}
            </span>

            {/* Completion Status */}
            {task.isCompleted && (
              <span className="px-2 py-1 bg-[#00ff88]/10 text-[#00ff88] rounded text-xs border border-[#00ff88]/20">
                ✓ Completed
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Progress Section */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-[#a0a0a0]">
            {task.completedPomodoros} / {task.estimatedPomodoros} Pomodoros
          </span>
          <span className="text-[#a0a0a0]">{Math.round(progressPercentage)}%</span>
        </div>

        {/* Progress Bar - Re-themed to Green */}
        <div className="w-full bg-[#333333] rounded-full h-1.5">
          <div
            className={`h-1.5 rounded-full transition-all ${
              task.isCompleted ? 'bg-[#00ff88]' : 'bg-[#00cc6a]'
            }`}
            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
          ></div>
        </div>
      </div>

      {/* AI Breakdown Section */}
      {task.aiBreakdown && task.aiBreakdown.length > 0 && (
        <div className="mb-4">
          <button
            onClick={() => setShowFullBreakdown(!showFullBreakdown)}
            className="w-full p-3 bg-[#0a0a0a] border border-[#333333] rounded-lg hover:border-[#00ff88]/30 transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#00ff88]" />
                <span className="text-sm font-medium text-[#00ff88]">AI Breakdown</span>
                <span className="text-xs text-[#6b6b6b]">({task.aiBreakdown.length} sessions)</span>
              </div>
              {showFullBreakdown ? (
                <ChevronUp className="w-4 h-4 text-[#00ff88]" />
              ) : (
                <ChevronDown className="w-4 h-4 text-[#00ff88]" />
              )}
            </div>
          </button>

          {/* Expandable Breakdown */}
          {showFullBreakdown && (
            <div className="mt-2 space-y-2 animate-fade-in">
              {task.aiBreakdown.map((item, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border ${
                    item.completed
                      ? 'bg-[#00ff88]/5 border-[#00ff88]/20'
                      : 'bg-[#1a1a1a] border-[#333333]'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-[#00ff88]/10 rounded flex items-center justify-center text-xs font-bold text-[#00ff88] border border-[#00ff88]/20">
                      {item.pomodoroNumber}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <span
                          className={`text-sm font-medium ${
                            item.completed ? 'text-[#00ff88] line-through' : 'text-white'
                          }`}
                        >
                          {item.subtask}
                        </span>
                        <span className={`text-xs ${getDifficultyColor(item.difficulty)}`}>
                          {getDifficultyLabel(item.difficulty)}
                        </span>
                      </div>
                      <div className="space-y-1 mt-2">
                        {item.steps.slice(0, 2).map((step, stepIndex) => (
                          <div key={stepIndex} className="text-xs text-[#a0a0a0] flex items-start gap-1">
                            <span>•</span>
                            <span>{step}</span>
                          </div>
                        ))}
                        {item.steps.length > 2 && (
                          <div className="text-xs text-[#6b6b6b]">
                            +{item.steps.length - 2} more steps...
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2">
        {!task.isCompleted && (
          <button
            onClick={handleStartTimer}
            className="flex-1 flex items-center justify-center gap-2 bg-[#00ff88]/10 hover:bg-[#00ff88]/20 text-[#00ff88] px-4 py-2 rounded-lg transition-all border border-[#00ff88]/30"
          >
            <Play className="w-4 h-4" fill="currentColor" />
            <span className="font-medium">Start</span>
          </button>
        )}

        <button
          onClick={handleDelete}
          className="flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 px-4 py-2 rounded-lg transition-all border border-red-500/30"
        >
          <Trash2 className="w-4 h-4" />
          <span className="font-medium">Delete</span>
        </button>
      </div>
    </div>
  );
};

export default TaskCard;