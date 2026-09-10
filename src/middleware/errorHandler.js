const { logEvent } = require('../utils/logger');

function errorHandler(err, req, res, next) {
  logEvent('ERROR', err.stack || err.message);

  res.status(err.status || 500).json({
    success: false,
    error: {
      code: err.code || 'INTERNAL_SERVER_ERROR',
      message: err.message || 'An unexpected error occurred on the server.'
    }
  });
}

// Export the function directly as middleware
module.exports = errorHandler;