const { routeIntent } = require('../services/router.service');
const { getStockPrice } = require('../tools/stockPrice.tool');
const { getFundamentals } = require('../tools/fundamentals.tool');
const { searchKnowledgeBase } = require('../services/knowledge.service');
const { generateLLMResponse } = require('../services/llm.service');
const { getSessionHistory, addMessageToSession } = require('../utils/sessionStore');
const { logEvent } = require('../utils/logger');

async function handleChat(req, res, next) {
  try {
    const { sessionId, message } = req.body;
    logEvent('CHAT', `session=${sessionId} message="${message}"`);

    // Fetch existing session history
    const history = getSessionHistory(sessionId);

    // Classify intent via LLM router passing existing context
    const routeResult = await routeIntent(message, history);
    const { intent, symbol } = routeResult;

    let toolData = null;

    switch (intent) {
      case 'stock_price':
        toolData = getStockPrice(symbol);
        break;
      case 'fundamentals':
        toolData = getFundamentals(symbol);
        break;
      case 'knowledge_base':
        toolData = searchKnowledgeBase(message);
        break;
      case 'explanation':
      case 'greeting':
      case 'unknown':
      default:
        toolData = null;
        break;
    }

    if (toolData) {
      logEvent('TOOL', `Executed intent=${intent} data=${JSON.stringify(toolData)}`);
    }

    // Generate response passing conversation context
    const assistantResponse = await generateLLMResponse(message, history, intent, toolData);

    // Save user query and assistant response to session memory
    addMessageToSession(sessionId, 'user', message);
    addMessageToSession(sessionId, 'assistant', assistantResponse);

    return res.status(200).json({
      success: true,
      sessionId,
      intent,
      data: toolData || {},
      response: assistantResponse
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { handleChat };