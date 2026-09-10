/**
 * Log structured application events
 */
function logEvent(type, details) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [${type.toUpperCase()}] ${details}`);
}

module.exports = { logEvent };