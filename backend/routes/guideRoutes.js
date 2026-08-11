const express = require('express');

const router = express.Router();

const {
    searchGuidesByCity,
    getGuideById,
    getAllGuides
} = require('../controllers/guideController');

// IMPORTANT: city route must exist
router.get('/city/:city', searchGuidesByCity);

// Get all guides
router.get('/', getAllGuides);

// Get one guide by MongoDB ID
router.get('/:id', getGuideById);

module.exports = router;