const express = require('express');
const router = express.Router();
const { chatWithGemini } = require('../controllers/chatbotController');

// Public route for chatbot
router.post('/', chatWithGemini);

module.exports = router;
