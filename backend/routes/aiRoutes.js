const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

// AI Trip Planning
router.post('/plan-trip', aiController.planTripWithAI);

// AI Chatbot
router.post('/chat', aiController.chatWithAI);

module.exports = router;