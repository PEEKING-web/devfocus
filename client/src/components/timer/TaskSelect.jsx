import { CheckCircle2, Circle, ChevronDown } from 'lucide-react';
import { useState } from 'react';

const TaskSelect = ({ tasks, selectedTask, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Filter only incomplete tasks
  const activeTasks = tasks.filter((task) => !task.isCompleted);

  const handleSelect = (task) => {
    onSelect(task);
    setIsOpen(false);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-red-400 bg-red-500/10 border-red-500/50';
      case 'medium':
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/50';
      case 'low':
        return 'text-green-400 bg-green-500/10 border-green-500/50';
      default:
        return 'text-gray-400 bg-gray-500/10 border-gray-500/50';
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Select Task to Focus On
      </label>

      {/* Dropdown Button */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full glass hover:bg-white/10 px-4 py-4 rounded-lg flex items-center justify-between transition-all"
        >
          {selectedTask ? (
            <div className="flex items-center gap-3 flex-1">
              {/* Task Icon */}
              <Circle className="w-5 h-5 text-blue-400" />
              
              {/* Task Info */}
              <div className="flex-1 text-left">
                <div className="font-medium text-white">{selectedTask.title}</div>
                <div className="text-sm text-gray-400">
                  {selectedTask.completedPomodoros}/{selectedTask.estimatedPomodoros} Pomodoros
                  {selectedTask.category && (
                    <span className="ml-2 px-2 py-0.5 rounded text-xs bg-blue-500/20 text-blue-400">
                      {selectedTask.category}
                    </span>
                  )}
                </div>
              </div>

              {/* Priority Badge */}
              <span
                className={`px-2 py-1 rounded text-xs font-medium border ${getPriorityColor(
                  selectedTask.priority
                )}`}
              >
                {selectedTask.priority}
              </span>
            </div>
          ) : (
            <span className="text-gray-400">Choose a task...</span>
          )}

          <ChevronDown
            className={`w-5 h-5 text-gray-400 transition-transform ml-2 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute w-full mt-2 glass-dark rounded-lg border border-gray-700 overflow-hidden z-10 max-h-80 overflow-y-auto">
            {activeTasks.length === 0 ? (
              <div className="p-4 text-center text-gray-400">
                No active tasks. Create one first!
              </div>
            ) : (
              activeTasks.map((task) => (
                <button
                  key={task._id}
                  onClick={() => handleSelect(task)}
                  className={`w-full px-4 py-3 hover:bg-white/5 transition-all text-left border-b border-gray-700 last:border-b-0 ${
                    selectedTask?._id === task._id ? 'bg-blue-500/10' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Selection Indicator */}
                    {selectedTask?._id === task._id ? (
                      <CheckCircle2 className="w-5 h-5 text-blue-400" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-400" />
                    )}

                    {/* Task Info */}
                    <div className="flex-1">
                      <div className="font-medium text-white">{task.title}</div>
                      <div className="text-sm text-gray-400 flex items-center gap-2">
                        <span>
                          {task.completedPomodoros}/{task.estimatedPomodoros} Pomodoros
                        </span>
                        {task.category && (
                          <span className="px-2 py-0.5 rounded text-xs bg-blue-500/20 text-blue-400">
                            {task.category}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Priority Badge */}
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium border ${getPriorityColor(
                        task.priority
                      )}`}
                    >
                      {task.priority}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-2 w-full bg-gray-700 rounded-full h-1.5">
                    <div
                      className="bg-blue-500 h-1.5 rounded-full transition-all"
                      style={{
                        width: `${
                          (task.completedPomodoros / task.estimatedPomodoros) * 100
                        }%`,
                      }}
                    ></div>
                  </div>
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {/* Task Progress Info */}
      {selectedTask && (
        <div className="mt-3 text-sm text-gray-400 flex items-center gap-2">
          <div className="flex-1 bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-primary h-2 rounded-full transition-all"
              style={{
                width: `${
                  (selectedTask.completedPomodoros / selectedTask.estimatedPomodoros) * 100
                }%`,
              }}
            ></div>
          </div>
          <span className="whitespace-nowrap">
            {Math.round(
              (selectedTask.completedPomodoros / selectedTask.estimatedPomodoros) * 100
            )}
            % Done
          </span>
        </div>
      )}
    </div>
  );
};

export default TaskSelect;