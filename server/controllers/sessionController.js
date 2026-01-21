const Session = require('../models/Session');
const User = require('../models/User');

// @desc    Create new session
// @route   POST /api/sessions
// @access  Private
const createSession = async (req, res, next) => {
  try {
    // Add userId from authenticated user
    req.body.userId = req.user.id;

    const session = await Session.create(req.body);

    // Populate task details
    await session.populate('taskId', 'title category');

    res.status(201).json({
      success: true,
      session,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all sessions for current user
// @route   GET /api/sessions
// @access  Private
const getSessions = async (req, res, next) => {
  try {
    const sessions = await Session.find({ userId: req.user.id })
      .populate('taskId', 'title category priority')
      .sort({ startedAt: -1 });

    res.status(200).json({
      success: true,
      count: sessions.length,
      sessions,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Complete a session
// @route   PUT /api/sessions/:id/complete
// @access  Private
const completeSession = async (req, res, next) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found',
      });
    }

    // Verify ownership
    if (session.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this session',
      });
    }

    // Mark session as completed
    session.completed = true;
    session.completedAt = new Date();
    
    // Add notes if provided
    if (req.body.notes) {
      session.notes = req.body.notes;
    }

    await session.save();

    // Update user's total Pomodoros
    const user = await User.findById(req.user.id);
    user.totalPomodoros += 1;

    // Update streak
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastActive = user.lastActiveDate
      ? new Date(user.lastActiveDate)
      : null;

    if (lastActive) {
      lastActive.setHours(0, 0, 0, 0);
      const diffTime = today - lastActive;
      const diffDays = diffTime / (1000 * 60 * 60 * 24);

      if (diffDays === 1) {
        // Consecutive day - increment streak
        user.currentStreak += 1;
      } else if (diffDays > 1) {
        // Streak broken - reset to 1
        user.currentStreak = 1;
      }
      // If same day (diffDays === 0), don't change streak
    } else {
      // First ever session
      user.currentStreak = 1;
    }

    // Update longest streak if current is higher
    if (user.currentStreak > user.longestStreak) {
      user.longestStreak = user.currentStreak;
    }

    user.lastActiveDate = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      session,
      user: {
        totalPomodoros: user.totalPomodoros,
        currentStreak: user.currentStreak,
        longestStreak: user.longestStreak,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user stats and analytics
// @route   GET /api/sessions/stats
// @access  Private
const getStats = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const sessions = await Session.find({ 
      userId: req.user.id,
      completed: true 
    });

    // Calculate today's Pomodoros
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todaySessions = sessions.filter(
      (session) => new Date(session.completedAt) >= today
    );

    // Calculate this week's Pomodoros
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekSessions = sessions.filter(
      (session) => new Date(session.completedAt) >= weekAgo
    );

    // Calculate total focus time (in minutes)
    const totalFocusTime = sessions.reduce(
      (total, session) => total + session.duration,
      0
    );

    // Get last 7 days data for chart
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      const daySessions = sessions.filter((session) => {
        const sessionDate = new Date(session.completedAt);
        return sessionDate >= date && sessionDate < nextDate;
      });

      last7Days.push({
        day: dayName,
        date: date.toISOString().split('T')[0],
        pomodoros: daySessions.length,
      });
    }

    res.status(200).json({
      success: true,
      stats: {
        totalPomodoros: user.totalPomodoros,
        todayPomodoros: todaySessions.length,
        weekPomodoros: weekSessions.length,
        currentStreak: user.currentStreak,
        longestStreak: user.longestStreak,
        totalFocusTime: totalFocusTime,
        totalFocusHours: (totalFocusTime / 60).toFixed(1),
        last7Days,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createSession,
  getSessions,
  completeSession,
  getStats,
};