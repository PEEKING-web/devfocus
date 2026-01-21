import { useState } from 'react';
import TaskCard from './TaskCard';
import { ListTodo, Filter } from 'lucide-react';

const TaskList = ({ tasks, onUpdate, onDelete, onSelect, onCreateTask }) => {
  const [filter, setFilter] = useState('all'); // all, active, completed
  const [sortBy, setSortBy] = useState('date'); // date, priority, progress

  // Filter tasks
  const getFilteredTasks = () => {
    let filtered = [...tasks];

    // Apply filter
    switch (filter) {
      case 'active':
        filtered = filtered.filter((task) => !task.isCompleted);
        break;
      case 'completed':
        filtered = filtered.filter((task) => task.isCompleted);
        break;
      default:
        // all - no filter
        break;
    }

    // Apply sort
    switch (sortBy) {
      case 'priority':
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        filtered.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
        break;
      case 'progress':
        filtered.sort((a, b) => {
          const progressA = (a.completedPomodoros / a.estimatedPomodoros) * 100;
          const progressB = (b.completedPomodoros / b.estimatedPomodoros) * 100;
          return progressB - progressA;
        });
        break;
      case 'date':
      default:
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
    }

    return filtered;
  };

  const filteredTasks = getFilteredTasks();

  // Count tasks
  const activeTasks = tasks.filter((task) => !task.isCompleted).length;
  const completedTasks = tasks.filter((task) => task.isCompleted).length;

  return (
    <div>
      {/* Filters & Sort Bar */}
      <div className="glass rounded-xl p-4 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* Filter Tabs */}
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-5 h-5 text-gray-400" />
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filter === 'all'
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              All ({tasks.length})
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filter === 'active'
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Active ({activeTasks})
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filter === 'completed'
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Completed ({completedTasks})
            </button>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <label htmlFor="sort" className="text-sm text-gray-400">
              Sort by:
            </label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-blue-500"
            >
              <option value="date">Date Created</option>
              <option value="priority">Priority</option>
              <option value="progress">Progress</option>
            </select>
          </div>
        </div>
      </div>

      {/* Task Grid */}
      {filteredTasks.length === 0 ? (
        // Empty State
        <div className="glass rounded-xl p-12 text-center">
          <ListTodo className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">
            {filter === 'completed'
              ? 'No completed tasks yet'
              : filter === 'active'
              ? 'No active tasks'
              : 'No tasks yet'}
          </h3>
          <p className="text-gray-500 mb-6">
            {filter === 'all'
              ? 'Create your first task to get started!'
              : `Switch to "${filter === 'completed' ? 'Active' : 'All'}" to see your tasks.`}
          </p>
              {filter === 'all' && onCreateTask && (
          <button
            onClick={onCreateTask}
            className="btn-primary"
          >
            Create Your First Task
          </button>
        )}
        </div>
      ) : (
        // Task Cards Grid
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onUpdate={onUpdate}
              onDelete={onDelete}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}

      {/* Stats Footer */}
      {filteredTasks.length > 0 && (
        <div className="mt-6 text-center text-sm text-gray-400">
          Showing {filteredTasks.length} of {tasks.length} task
          {tasks.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
};

export default TaskList;