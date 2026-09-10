const express = require('express');
const router = express.Router();
const { handleChat } = require('../controllers/chat.controller');
const authenticateToken = require('../middleware/auth.middleware');

// Protected chat route
router.post('/chat', authenticateToken, handleChat);

module.exports = router;