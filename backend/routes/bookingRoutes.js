const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { authenticateToken, optionalToken } = require('../middleware/auth');

// Create new booking (Tourist)
router.post('/', optionalToken, bookingController.createBooking);

// Get tourist bookings
router.get('/tourist', optionalToken, bookingController.getTouristBookings);

// Get guide bookings (Protected for logged in guide)
router.get('/guide', authenticateToken, bookingController.getGuideBookings);

// Legacy backward compatibility endpoint for existing calls
router.get('/dashboard/bookings', authenticateToken, bookingController.getGuideBookings);

// Update booking status (Accept / Reject / Complete)
router.patch('/:bookingId/status', authenticateToken, bookingController.updateBookingStatus);

module.exports = router;
