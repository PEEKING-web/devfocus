import { Flame } from 'lucide-react';

const StreakCalendar = ({ sessions }) => {
  if (!sessions || sessions.length === 0) {
    return (
      <div className="glass rounded-xl p-8 text-center">
        <p className="text-gray-400">No sessions yet. Complete Pomodoros to see your streak calendar!</p>
      </div>
    );
  }

  // Generate last 30 days
  const getLast30Days = () => {
    const days = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      days.push(date);
    }
    
    return days;
  };

  // Count Pomodoros per day
  const getPomodorosPerDay = () => {
    const counts = {};
    
    sessions.forEach((session) => {
      if (session.completed) {
        const date = new Date(session.completedAt);
        date.setHours(0, 0, 0, 0);
        const dateStr = date.toISOString().split('T')[0];
        counts[dateStr] = (counts[dateStr] || 0) + 1;
      }
    });
    
    return counts;
  };

  const last30Days = getLast30Days();
  const pomodorosPerDay = getPomodorosPerDay();

  // Get color based on count
  const getColor = (count) => {
    if (count === 0) return 'bg-gray-800';
    if (count === 1) return 'bg-green-900';
    if (count === 2) return 'bg-green-700';
    if (count >= 3 && count <= 4) return 'bg-green-500';
    return 'bg-green-400';
  };

  // Get intensity label
  const getIntensityLabel = (count) => {
    if (count === 0) return 'No activity';
    if (count === 1) return 'Low activity';
    if (count === 2) return 'Moderate activity';
    if (count >= 3 && count <= 4) return 'High activity';
    return 'Very high activity';
  };

  return (
    <div className="glass rounded-xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-white mb-2 flex items-center gap-2">
            <Flame className="w-6 h-6 text-orange-400" />
            Activity Streak
          </h3>
          <p className="text-sm text-gray-400">Your Pomodoro activity over the last 30 days</p>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="mb-4">
        <div className="grid grid-cols-10 gap-2">
          {last30Days.map((date, index) => {
            const dateStr = date.toISOString().split('T')[0];
            const count = pomodorosPerDay[dateStr] || 0;
            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
            const dateNum = date.getDate();

            return (
              <div
                key={index}
                className="group relative"
                title={`${date.toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric' 
                })}: ${count} Pomodoro${count !== 1 ? 's' : ''}`}
              >
                <div
                  className={`w-full aspect-square rounded ${getColor(count)} 
                    transition-all duration-200 cursor-pointer
                    hover:ring-2 hover:ring-blue-400 hover:scale-110`}
                ></div>
                
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 
                  opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  <div className="glass-dark rounded-lg p-2 text-xs whitespace-nowrap border border-blue-500/50">
                    <div className="text-white font-semibold">
                      {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                    <div className="text-gray-400">
                      {count} Pomodoro{count !== 1 ? 's' : ''}
                    </div>
                    <div className="text-blue-400 text-xs">
                      {getIntensityLabel(count)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-700">
        <div className="text-sm text-gray-400">Less</div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gray-800"></div>
          <div className="w-4 h-4 rounded bg-green-900"></div>
          <div className="w-4 h-4 rounded bg-green-700"></div>
          <div className="w-4 h-4 rounded bg-green-500"></div>
          <div className="w-4 h-4 rounded bg-green-400"></div>
        </div>
        <div className="text-sm text-gray-400">More</div>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-3 gap-4 pt-4 border-t border-gray-700">
        <div className="text-center">
          <div className="text-2xl font-bold text-white">
            {Object.values(pomodorosPerDay).reduce((sum, count) => sum + count, 0)}
          </div>
          <div className="text-xs text-gray-400">Total (30 days)</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-400">
            {Object.keys(pomodorosPerDay).length}
          </div>
          <div className="text-xs text-gray-400">Active Days</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-400">
            {Math.max(...Object.values(pomodorosPerDay), 0)}
          </div>
          <div className="text-xs text-gray-400">Best Day</div>
        </div>
      </div>
    </div>
  );
};

export default StreakCalendar;