const aiService = require('../utils/aiService');


const breakdownTask = async (req, res, next) => {
  try {
    const { title, description } = req.body;

    // Validation
    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a task title',
      });
    }

    // Call AI service
    const breakdown = await aiService.breakdownTask(title, description);

    res.status(200).json({
      success: true,
      breakdown,
    });
  } catch (error) {
    console.error('Breakdown Task Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate task breakdown',
    });
  }
};


const suggestBreak = async (req, res, next) => {
  try {
    const { sessionCount, timeOfDay } = req.body;

    // Get current time if not provided
    const currentTime = timeOfDay || new Date().toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });

    // Call AI service
    const suggestion = await aiService.suggestBreakActivity(
      sessionCount || 1,
      currentTime
    );

    res.status(200).json({
      success: true,
      suggestion,
    });
  } catch (error) {
    console.error('Suggest Break Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate break suggestion',
      suggestion: 'Take a 5-minute walk and grab some water.',
    });
  }
};

module.exports = {
  breakdownTask,
  suggestBreak,
};