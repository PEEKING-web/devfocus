import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import * as sessionService from '../../services/sessionService';
import * as taskService from '../../services/taskService';
import { 
  Play, 
  ListTodo, 
  TrendingUp, 
  Flame, 
  Clock, 
  Target,
  ArrowRight,
  Sparkles,
  Loader
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [todayStats, setTodayStats] = useState(null);
  const [recentSessions, setRecentSessions] = useState([]);
  const [activeTasks, setActiveTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      const [statsResponse, sessionsResponse, tasksResponse] = await Promise.all([
        sessionService.getStats(),
        sessionService.getSessions(),
        taskService.getTasks(),
      ]);

      setTodayStats(statsResponse.stats);
      setRecentSessions(sessionsResponse.sessions.slice(0, 3));
      
      // Get active tasks (not completed), limit to 3
      const active = tasksResponse.tasks.filter(task => !task.isCompleted).slice(0, 3);
      setActiveTasks(active);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const motivationalQuotes = [
    "Focus is the gateway to productivity.",
    "Small steps every day lead to big results.",
    "Your future is created by what you do today.",
    "Consistency beats intensity every time.",
    "Progress, not perfection.",
    "One Pomodoro at a time.",
  ];

  const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 bg-[#0a0a0a]">
        <Loader className="w-12 h-12 text-[#00ff88] animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">
          {getGreeting()}, {user?.name?.split(' ')[0] || 'there'}! 👋
        </h1>
        <p className="text-[#a0a0a0] text-lg">{randomQuote}</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {/* Today's Pomodoros */}
        <div className="bg-[#1a1a1a] rounded-lg p-5 border border-[#333333]">
          <div className="flex items-center justify-between mb-3">
            <Clock className="w-8 h-8 text-[#00ff88]" />
            <div className="text-right">
              <div className="text-3xl font-bold text-white">
                {todayStats?.todayPomodoros || 0}
              </div>
              <div className="text-xs text-[#a0a0a0]">Today</div>
            </div>
          </div>
          <div className="text-sm text-[#a0a0a0]">Pomodoros Completed</div>
        </div>

        {/* Current Streak */}
        <div className="bg-[#1a1a1a] rounded-lg p-5 border border-[#ffa116]/50">
          <div className="flex items-center justify-between mb-3">
            <Flame className="w-8 h-8 text-[#ffa116]" />
            <div className="text-right">
              <div className="text-3xl font-bold text-white">
                {todayStats?.currentStreak || 0}
              </div>
              <div className="text-xs text-[#a0a0a0]">Days</div>
            </div>
          </div>
          <div className="text-sm text-[#a0a0a0]">Current Streak</div>
        </div>

        {/* Total Pomodoros */}
        <div className="bg-[#1a1a1a] rounded-lg p-5 border border-[#333333]">
          <div className="flex items-center justify-between mb-3">
            <Target className="w-8 h-8 text-[#00ff88]" />
            <div className="text-right">
              <div className="text-3xl font-bold text-white">
                {todayStats?.totalPomodoros || 0}
              </div>
              <div className="text-xs text-[#a0a0a0]">All Time</div>
            </div>
          </div>
          <div className="text-sm text-[#a0a0a0]">Total Pomodoros</div>
        </div>

        {/* Active Tasks */}
        <div className="bg-[#1a1a1a] rounded-lg p-5 border border-[#333333]">
          <div className="flex items-center justify-between mb-3">
            <ListTodo className="w-8 h-8 text-[#00ff88]" />
            <div className="text-right">
              <div className="text-3xl font-bold text-white">
                {activeTasks.length}
              </div>
              <div className="text-xs text-[#a0a0a0]">Active</div>
            </div>
          </div>
          <div className="text-sm text-[#a0a0a0]">Tasks in Progress</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Active Tasks */}
        <div className="lg:col-span-2">
          <div className="bg-[#1a1a1a] rounded-lg p-6 mb-6 border border-[#333333]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Active Tasks</h2>
              <button
                onClick={() => navigate('/dashboard/tasks')}
                className="text-[#00ff88] hover:text-[#00cc6a] text-sm flex items-center gap-1"
              >
                View All
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {activeTasks.length === 0 ? (
              <div className="text-center py-8">
                <ListTodo className="w-12 h-12 text-[#6b6b6b] mx-auto mb-3" />
                <p className="text-[#a0a0a0] mb-4">No active tasks yet</p>
                <button
                  onClick={() => navigate('/dashboard/tasks')}
                  className="btn-primary"
                >
                  Create Your First Task
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {activeTasks.map((task) => (
                  <div
                    key={task._id}
                    className="bg-[#2c2c2c] border border-[#333333] rounded-lg p-4 hover:border-[#00ff88]/50 transition-all cursor-pointer"
                    onClick={() => navigate('/dashboard/timer')}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="text-white font-medium mb-1">{task.title}</h3>
                        <div className="flex items-center gap-2">
                          {task.category && (
                            <span className="px-2 py-0.5 bg-[#00ff88]/10 text-[#00ff88] rounded text-xs">
                              {task.category}
                            </span>
                          )}
                          <span className="text-xs text-[#a0a0a0]">
                            {task.completedPomodoros}/{task.estimatedPomodoros} Pomodoros
                          </span>
                        </div>
                      </div>
                      <button className="bg-[#00ff88]/10 hover:bg-[#00ff88]/20 text-[#00ff88] px-3 py-1 rounded-lg text-sm flex items-center gap-1">
                        <Play className="w-3 h-3" fill="currentColor" />
                        Start
                      </button>
                    </div>
                    
                    {/* Progress bar */}
                    <div className="w-full bg-[#1a1a1a] rounded-full h-1.5 mt-3">
                      <div
                        className="bg-gradient-to-r from-[#00ff88] to-[#00cc6a] h-1.5 rounded-full transition-all"
                        style={{
                          width: `${(task.completedPomodoros / task.estimatedPomodoros) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => navigate('/dashboard/timer')}
              className="bg-[#1a1a1a] rounded-lg p-6 hover:bg-[#2c2c2c] border border-[#333333] transition-all text-left group"
            >
              <div className="w-12 h-12 bg-[#00ff88]/10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Play className="w-6 h-6 text-[#00ff88]" />
              </div>
              <h3 className="text-white font-semibold mb-1">Start Timer</h3>
              <p className="text-sm text-[#a0a0a0]">Begin a Pomodoro session</p>
            </button>

            <button
              onClick={() => navigate('/dashboard/analytics')}
              className="bg-[#1a1a1a] rounded-lg p-6 hover:bg-[#2c2c2c] border border-[#333333] transition-all text-left group"
            >
              <div className="w-12 h-12 bg-[#00ff88]/10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6 text-[#00ff88]" />
              </div>
              <h3 className="text-white font-semibold mb-1">View Analytics</h3>
              <p className="text-sm text-[#a0a0a0]">Track your progress</p>
            </button>
          </div>
        </div>

        {/* Right Column - Recent Activity */}
        <div className="lg:col-span-1">
          <div className="bg-[#1a1a1a] rounded-lg p-6 border border-[#333333]">
            <h2 className="text-xl font-bold text-white mb-6">Recent Activity</h2>

            {recentSessions.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="w-12 h-12 text-[#6b6b6b] mx-auto mb-3" />
                <p className="text-[#a0a0a0] text-sm">No sessions yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentSessions.map((session) => (
                  <div
                    key={session._id}
                    className="pb-4 border-b border-[#333333] last:border-b-0 last:pb-0"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-[#00ff88] rounded-full mt-2"></div>
                      <div className="flex-1">
                        <h4 className="text-white text-sm font-medium mb-1">
                          {session.taskId?.title || 'Untitled'}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-[#a0a0a0]">
                          <span>{session.duration} min</span>
                          <span>•</span>
                          <span>{formatTime(session.completedAt || session.startedAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pro Tip Card */}
          <div className="bg-[#1a1a1a] rounded-lg p-6 mt-6 border border-[#ffa116]/30">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-[#ffa116] mt-0.5" />
              <div>
                <h3 className="text-white font-semibold mb-2">Pro Tip</h3>
                <p className="text-sm text-[#a0a0a0]">
                  Break large tasks into smaller chunks. Each Pomodoro should focus on one specific subtask!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;