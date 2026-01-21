const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide a task title'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      default: 'general',
      trim: true,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    estimatedPomodoros: {
      type: Number,
      default: 1,
      min: 1,
    },
    completedPomodoros: {
      type: Number,
      default: 0,
      min: 0,
    },
    aiGenerated: {
      type: Boolean,
      default: false,
    },
    aiBreakdown: [
      {
        pomodoroNumber: Number,
        subtask: String,
        steps: [String],
        difficulty: {
          type: Number,
          min: 1,
          max: 3,
        },
        completed: {
          type: Boolean,
          default: false,
        },
      },
    ],
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-mark task as completed when all Pomodoros are done
taskSchema.pre('save', function () {
  if (this.completedPomodoros >= this.estimatedPomodoros) {
    this.isCompleted = true;
  }
});

module.exports = mongoose.model('Task', taskSchema);