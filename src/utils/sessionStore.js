// In-memory store for user sessions
const sessions = new Map();

/**
 * Get or initialize session history
 */
function getSessionHistory(sessionId) {
  if (!sessionId) return [];
  if (!sessions.has(sessionId)) {
    sessions.set(sessionId, []);
  }
  return sessions.get(sessionId);
}

/**
 * Add a message to session history
 */
function addMessageToSession(sessionId, role, content) {
  if (!sessionId) return;
  const history = getSessionHistory(sessionId);
  
  history.push({ role, content });

  // Limit conversation history to last 10 messages to keep context concise
  if (history.length > 10) {
    history.shift();
  }

  sessions.set(sessionId, history);
}

/**
 * Clear session (useful for testing/reset)
 */
function clearSession(sessionId) {
  sessions.delete(sessionId);
}

module.exports = {
  getSessionHistory,
  addMessageToSession,
  clearSession
};