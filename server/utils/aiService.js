const axios = require('axios');

// Groq API endpoint
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// Break down a task into Pomodoro sessions using Groq
const breakdownTask = async (title, description = '') => {
  try {
    const prompt = `You are a productivity expert helping developers break down coding tasks into focused 25-minute Pomodoro sessions.

Task Title: ${title}
Task Description: ${description || 'No additional description provided'}

Break this task down into 4-6 specific Pomodoro sessions. Each session should:
1. Be completable in 25 minutes
2. Have a clear, actionable goal
3. Include 2-4 specific steps to accomplish
4. Have a difficulty rating (1=Easy, 2=Medium, 3=Hard)

Return ONLY a valid JSON array (no markdown, no backticks, no explanation) with this exact structure:
[
  {
    "pomodoroNumber": 1,
    "subtask": "Brief title of what to accomplish",
    "steps": ["Step 1", "Step 2", "Step 3"],
    "difficulty": 2
  }
]

Keep subtasks focused and realistic for 25-minute sessions. Be specific and actionable. Return ONLY the JSON array, nothing else.`;

    const response = await axios.post(
      GROQ_API_URL,
      {
        model: 'llama-3.3-70b-versatile', // Fast and free model
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const aiResponse = response.data.choices[0].message.content;
    
    // Clean up response - remove markdown code blocks if present
    let cleanText = aiResponse.trim();
    cleanText = cleanText.replace(/```json\n?/g, '');
    cleanText = cleanText.replace(/```\n?/g, '');
    cleanText = cleanText.trim();

    // Parse JSON response
    const breakdown = JSON.parse(cleanText);

    return breakdown;
  } catch (error) {
    console.error('AI Breakdown Error:', error.response?.data || error.message);
    throw new Error('Failed to generate AI breakdown. Please try again.');
  }
};

// Suggest a break activity using Groq
const suggestBreakActivity = async (sessionCount, timeOfDay) => {
  try {
    const prompt = `You are a wellness coach helping a developer take an effective break after completing ${sessionCount} Pomodoro session(s).

Current time: ${timeOfDay}

Suggest ONE specific, actionable 5-minute break activity that will help them:
- Rest their eyes
- Move their body
- Reset their mind
- Prepare for the next session

Keep it under 40 words. Be specific and encouraging. Return ONLY the suggestion text (no formatting, no prefix like "Here's a suggestion:").`;

    const response = await axios.post(
      GROQ_API_URL,
      {
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 150
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const suggestion = response.data.choices[0].message.content.trim();
    return suggestion;
  } catch (error) {
    console.error('AI Break Suggestion Error:', error.response?.data || error.message);
    // Return a fallback suggestion
    return 'Stand up, stretch your arms and legs, and look at something 20 feet away for 20 seconds to rest your eyes.';
  }
};

module.exports = {
  breakdownTask,
  suggestBreakActivity,
};