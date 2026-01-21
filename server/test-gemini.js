const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function testModels() {
  const models = [
    'gemini-1.5-flash-latest',
    'gemini-1.5-flash',
    'gemini-1.5-pro-latest',
    'gemini-pro'
  ];

  for (const modelName of models) {
    try {
      console.log(`\nTesting: ${modelName}`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent('Say hello');
      const response = await result.response;
      console.log(`✅ ${modelName} works!`);
      console.log('Response:', response.text());
      break; // Stop at first working model
    } catch (error) {
      console.log(`❌ ${modelName} failed: ${error.message}`);
    }
  }
}

testModels();