const express = require('express');
const {
  createSession,
  getSessions,
  completeSession,
  getStats,
} = require('../controllers/sessionController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes are protected (require authentication)
router.use(protect);

// Session routes
router.route('/').post(createSession).get(getSessions);

// Stats route (must be before /:id routes to avoid conflict)
router.get('/stats', getStats);

// Complete session
router.put('/:id/complete', completeSession);

module.exports = router;