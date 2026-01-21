import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import StatsCards from '../../components/analytics/StatsCards';
import WeeklyChart from '../../components/analytics/WeeklyChart';
import CategoryChart from '../../components/analytics/CategoryChart';
import StreakCalendar from '../../components/analytics/StreakCalendar';
import RecentSessions from '../../components/analytics/RecentSessions';
import * as sessionService from '../../services/sessionService';
import * as taskService from '../../services/taskService';
import { Loader, TrendingUp } from 'lucide-react';

const Analytics = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [statsResponse, sessionsResponse, tasksResponse] = await Promise.all([
        sessionService.getStats(),
        sessionService.getSessions(),
        taskService.getTasks(),
      ]);

      setStats(statsResponse.stats);
      setSessions(sessionsResponse.sessions);
      setTasks(tasksResponse.tasks);
      setError('');
    } catch (err) {
      console.error('Error fetching analytics data:', err);
      setError('Failed to load analytics. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 bg-[#0a0a0a]">
        <div className="text-center">
          <Loader className="w-12 h-12 text-[#00ff88] animate-spin mx-auto mb-4" />
          <p className="text-[#a0a0a0]">Loading your analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-8 text-center">
        <p className="text-red-400 mb-4">{error}</p>
        <button onClick={fetchAllData} className="btn-primary">
          Try Again
        </button>
      </div>
    );
  }

  // Check if user has any data
  const hasData = stats && (stats.totalPomodoros > 0 || tasks.length > 0);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <TrendingUp className="w-8 h-8 text-[#00ff88]" />
          <h1 className="text-4xl font-bold text-white">Analytics</h1>
        </div>
        <p className="text-[#a0a0a0]">
          Track your productivity and see your progress over time
        </p>
      </div>

      {!hasData ? (
        /* Empty State */
        <div className="bg-[#1a1a1a] border border-[#333333] rounded-lg p-12 text-center">
          <div className="w-20 h-20 bg-[#00ff88]/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <TrendingUp className="w-10 h-10 text-[#00ff88]" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">
            Start Tracking Your Productivity
          </h2>
          <p className="text-[#a0a0a0] mb-8 max-w-md mx-auto">
            Create some tasks and complete Pomodoro sessions to see your analytics and track your progress!
          </p>
          <div className="flex gap-4 justify-center">
            <a href="/dashboard/tasks" className="btn-primary">
              Create Your First Task
            </a>
            <a href="/dashboard/timer" className="btn-secondary">
              Start a Pomodoro
            </a>
          </div>
        </div>
      ) : (
        /* Analytics Dashboard */
        <>
          {/* Stats Cards */}
          <StatsCards stats={stats} />

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Weekly Chart - Takes 2 columns */}
            <div className="lg:col-span-2">
              <WeeklyChart data={stats?.last7Days || []} />
            </div>

            {/* Category Chart - Takes 1 column */}
            <div className="lg:col-span-1">
              <CategoryChart tasks={tasks} />
            </div>
          </div>

          {/* Streak Calendar */}
          <div className="mb-6">
            <StreakCalendar sessions={sessions} />
          </div>

          {/* Recent Sessions */}
          <div className="mb-6">
            <RecentSessions sessions={sessions} />
          </div>

          {/* Motivational Footer */}
          {stats?.currentStreak > 0 && (
            <div className="bg-[#1a1a1a] rounded-lg p-6 text-center border border-[#ffa116]/50">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-4xl">🔥</span>
                <span className="text-2xl font-bold text-white">
                  {stats.currentStreak} Day Streak!
                </span>
              </div>
              <p className="text-[#a0a0a0]">
                Keep it up! You're building amazing habits.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Analytics;