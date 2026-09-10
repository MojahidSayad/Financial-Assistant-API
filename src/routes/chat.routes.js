const express = require('express');
const router = express.Router();
const { handleChat } = require('../controllers/chat.controller');
const { validateChatRequest } = require('../middleware/validation');

router.post('/chat', validateChatRequest, handleChat);

module.exports = router;