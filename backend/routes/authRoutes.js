const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Guide Auth Routes
router.post('/guides/register', authController.registerGuide);
router.post('/guides/login', authController.loginGuide);

// Tourist Auth Routes
router.post('/tourists/register', authController.registerTourist);
router.post('/tourists/login', authController.loginTourist);

module.exports = router;
