const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

// AI Trip Planning route
router.post('/plan-trip', aiController.planTripWithAI);

module.exports = router;
