const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer <token>"

  if (!token) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'MISSING_TOKEN',
        message: 'Access token is required. Please log in first.'
      }
    });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'default_jwt_secret', (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'INVALID_TOKEN',
          message: 'Token is invalid or expired.'
        }
      });
    }

    req.user = user;
    next();
  });
};

module.exports = authenticateToken;