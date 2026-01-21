import { Clock, CheckCircle2, Calendar } from 'lucide-react';

const RecentSessions = ({ sessions }) => {
  if (!sessions || sessions.length === 0) {
    return (
      <div className="glass rounded-xl p-8 text-center">
        <Clock className="w-12 h-12 text-gray-600 mx-auto mb-3" />
        <p className="text-gray-400">No sessions yet. Start your first Pomodoro to see activity here!</p>
      </div>
    );
  }

  // Get recent 10 sessions
  const recentSessions = sessions.slice(0, 10);

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Format time
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  // Group by date
  const groupByDate = (sessions) => {
    const groups = {};
    
    sessions.forEach((session) => {
      const date = new Date(session.completedAt || session.startedAt);
      const dateKey = date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      });
      
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(session);
    });
    
    return groups;
  };

  const groupedSessions = groupByDate(recentSessions);

  return (
    <div className="glass rounded-xl p-6">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-white mb-2">Recent Sessions</h3>
        <p className="text-sm text-gray-400">Your latest Pomodoro activity</p>
      </div>

      <div className="space-y-6">
        {Object.entries(groupedSessions).map(([date, dateSessions]) => (
          <div key={date}>
            {/* Date Header */}
            <div className="flex items-center gap-2 mb-3 sticky top-0 bg-gray-900/80 backdrop-blur-sm py-2 -mx-2 px-2 rounded">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-300">{date}</span>
              <div className="flex-1 h-px bg-gray-700"></div>
            </div>

            {/* Sessions for this date */}
            <div className="space-y-3 pl-4">
              {dateSessions.map((session) => (
                <div
                  key={session._id}
                  className="relative pl-6 pb-4 border-l-2 border-gray-700 last:border-l-0 last:pb-0"
                >
                  {/* Timeline dot */}
                  <div
                    className={`absolute left-0 top-1 -translate-x-1/2 w-3 h-3 rounded-full ${
                      session.completed ? 'bg-green-500' : 'bg-gray-500'
                    } ring-4 ring-gray-900`}
                  ></div>

                  {/* Session card */}
                  <div className="glass-dark rounded-lg p-4 hover:bg-white/5 transition-all">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {session.completed && (
                            <CheckCircle2 className="w-4 h-4 text-green-400" />
                          )}
                          <h4 className="text-white font-medium">
                            {session.taskId?.title || 'Untitled Task'}
                          </h4>
                        </div>
                        
                        {session.taskId?.category && (
                          <span className="inline-block px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded text-xs mb-2">
                            {session.taskId.category}
                          </span>
                        )}
                      </div>

                      <div className="text-right">
                        <div className="text-sm font-semibold text-white">
                          {session.duration} min
                        </div>
                        <div className="text-xs text-gray-400">
                          {formatTime(session.completedAt || session.startedAt)}
                        </div>
                      </div>
                    </div>

                            {/* Notes */}
              {session.notes && (
                <div className="mt-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                  <p className="text-xs text-gray-400 mb-1 font-semibold">📝 Session Notes:</p>
                  <p className="text-sm text-gray-300 whitespace-pre-wrap">{session.notes}</p>
                </div>
              )}

                    {/* Status */}
                    <div className="mt-2 flex items-center justify-between text-xs">
                      <span
                        className={`px-2 py-1 rounded ${
                          session.completed
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}
                      >
                        {session.completed ? 'Completed' : 'In Progress'}
                      </span>
                      <span className="text-gray-500">
                        {formatDate(session.completedAt || session.startedAt)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Show more hint */}
      {sessions.length > 10 && (
        <div className="mt-6 pt-4 border-t border-gray-700 text-center">
          <p className="text-sm text-gray-400">
            Showing 10 of {sessions.length} sessions
          </p>
        </div>
      )}
    </div>
  );
};

export default RecentSessions;