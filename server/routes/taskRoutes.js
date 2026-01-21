const express = require('express');
const {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
  incrementPomodoro,
} = require('../controllers/taskController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes are protected (require authentication)
router.use(protect);

// Task CRUD routes
router.route('/').post(createTask).get(getTasks);

router.route('/:id').get(getTask).put(updateTask).delete(deleteTask);

// Increment Pomodoro count
router.put('/:id/increment', incrementPomodoro);

module.exports = router;