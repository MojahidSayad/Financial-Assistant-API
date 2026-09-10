const jwt = require('jsonwebtoken');

// Simple credentials for testing
const MOCK_USER = {
  email: 'admin@financial.com',
  password: 'password123',
  id: 'user_01'
};

const login = (req, res) => {
  const { email, password } = req.body;

  // 1. Field presence validation
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_INPUT',
        message: 'Email and password are required.'
      }
    });
  }

  // 2. Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_EMAIL',
        message: 'Please provide a valid email address.'
      }
    });
  }

  // 3. Credential check
  if (email !== MOCK_USER.email || password !== MOCK_USER.password) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Invalid email or password.'
      }
    });
  }

  // 4. Token generation (24-hour expiration)
  const token = jwt.sign(
    { userId: MOCK_USER.id, email: MOCK_USER.email },
    process.env.JWT_SECRET || 'default_jwt_secret',
    { expiresIn: '24h' }
  );

  return res.status(200).json({
    success: true,
    message: 'Login successful',
    token: token
  });
};

module.exports = { login };