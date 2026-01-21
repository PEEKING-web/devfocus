const express = require('express');
const { breakdownTask, suggestBreak } = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes are protected (require authentication)
router.use(protect);

// AI task breakdown
router.post('/breakdown', breakdownTask);

// AI break suggestion
router.post('/suggest-break', suggestBreak);

module.exports = router;