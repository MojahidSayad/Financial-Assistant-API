const { GoogleGenerativeAI } = require('@google/generative-ai');
const { ASSISTANT_SYSTEM_PROMPT } = require('../prompts/assistant.prompt');
const { logEvent } = require('../utils/logger');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.LLM_API_KEY || '');

async function generateLLMResponse(message, context, intent, toolData) {
  try {
    const rawModelName = process.env.LLM_MODEL || 'gemini-3.6-flash';
    const modelName = rawModelName.startsWith('models/') ? rawModelName : `models/${rawModelName}`;

    const model = genAI.getGenerativeModel({
      model: modelName
    });

    const contextText = (context || [])
      .slice(-4)
      .map(m => `${m.role.toUpperCase()}: ${m.content}`)
      .join('\n');

    const prompt = `
${ASSISTANT_SYSTEM_PROMPT}

Detected Intent: ${intent}
Fetched Backend Data: ${JSON.stringify(toolData || {})}

Conversation History:
${contextText}

User Query: "${message}"
`;

    const result = await model.generateContent(prompt);
    
    // Safely extract text from candidate response
    if (result && result.response) {
      return result.response.text();
    }

    // Direct data fallback if model returns empty response text
    if (intent === 'stock_price' && toolData?.price) {
      return `The current stock price for ${toolData.symbol} is ₹${toolData.price}.`;
    }

    return "I couldn't retrieve a response. Please try again.";
  } catch (error) {
    logEvent('ERROR', `LLM Generation failed: ${error.message}`);

    // Clean fallback using fetched tool data if LLM call throws error
    if (intent === 'stock_price' && toolData?.price) {
      return `The current stock price for ${toolData.symbol} is ₹${toolData.price}.`;
    }
    if (intent === 'fundamentals' && toolData?.symbol) {
      return `Fundamentals for ${toolData.symbol}: Market Cap ${toolData.marketCap}, P/E ${toolData.peRatio}, ROE ${toolData.roe}%.`;
    }

    return "I'm having trouble processing your request right now. Please try again shortly.";
  }
}

module.exports = { generateLLMResponse };