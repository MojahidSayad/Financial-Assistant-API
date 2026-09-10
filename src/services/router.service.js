const { GoogleGenerativeAI } = require('@google/generative-ai');
const { ROUTER_SYSTEM_PROMPT } = require('../prompts/router.prompt');
const { logEvent } = require('../utils/logger');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.LLM_API_KEY || '');

async function routeIntent(message, context = []) {
  try {
    const rawModelName = process.env.LLM_MODEL || 'gemini-3.6-flash';
    const modelName = rawModelName.startsWith('models/') ? rawModelName : `models/${rawModelName}`;

    const model = genAI.getGenerativeModel({
      model: modelName,
      generationConfig: { responseMimeType: 'application/json' }
    });

    const contextSummary = (context || [])
      .slice(-4)
      .map(m => `${m.role.toUpperCase()}: ${m.content}`)
      .join('\n');

    const prompt = `${ROUTER_SYSTEM_PROMPT}\n\nRecent Context:\n${contextSummary}\n\nCurrent User Query: "${message}"`;

    const result = await model.generateContent(prompt);
    const rawText = result.response.text();
    const parsed = JSON.parse(rawText);

    logEvent('ROUTER', `Intent=${parsed.intent} Symbol=${parsed.symbol || 'N/A'}`);
    return parsed;
  } catch (error) {
    logEvent('ERROR', `Router failed: ${error.message}`);
    // Default to explanation for conversational follow-ups if router fails
    return { intent: 'explanation', symbol: null, confidence: 0 };
  }
}

module.exports = { routeIntent };