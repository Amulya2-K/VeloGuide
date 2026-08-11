const Booking = require('../models/Booking');
const Guide = require('../models/Guide');

// 1. Create a new booking (Tourist)
exports.createBooking = async (req, res) => {
  try {
    const { 
      guideId, 
      touristName, 
      touristEmail, 
      touristPhone, 
      destination, 
      startDate, 
      endDate, 
      hoursPerDay, 
      specialRequests 
    } = req.body;

    const guide = await Guide.findById(guideId);
    if (!guide) {
      return res.status(404).json({ success: false, message: "Selected guide does not exist." });
    }

    // Calculate total price based on duration
    const start = new Date(startDate || Date.now());
    const end = new Date(endDate || startDate || Date.now());
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
    const hours = Number(hoursPerDay) || 4;
    const calculatedTotal = guide.hourlyRate * hours * diffDays;

    const newBooking = new Booking({
      touristId: req.user ? req.user.id : null,
      touristName: touristName || (req.user ? req.user.name : "Traveler"),
      touristEmail: touristEmail || '',
      touristPhone: touristPhone || '',
      guideId: guide._id,
      guideName: guide.name,
      destination: destination || guide.assignedCity,
      startDate: startDate || new Date().toISOString().split('T')[0],
      endDate: endDate || startDate || new Date().toISOString().split('T')[0],
      hoursPerDay: hours,
      totalPrice: calculatedTotal,
      specialRequests: specialRequests || '',
      status: 'Pending Confirmation'
    });

    await newBooking.save();

    res.status(201).json({
      success: true,
      message: "Booking request placed successfully!",
      booking: newBooking
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Fetch Tourist Bookings
exports.getTouristBookings = async (req, res) => {
  try {
    let filter = {};
    if (req.user && req.user.id) {
      filter = { touristId: req.user.id };
    } else if (req.query.email) {
      filter = { touristEmail: req.query.email };
    }

    const bookings = await Booking.find(filter).sort({ timestamp: -1 });
    res.json({ success: true, count: bookings.length, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error retrieving tourist bookings." });
  }
};

// 3. Fetch Guide Bookings (Protected for logged-in guide)
exports.getGuideBookings = async (req, res) => {
  try {
    const guideId = req.user.id;
    const activeBookings = await Booking.find({ guideId }).sort({ timestamp: -1 });

    res.json({ success: true, count: activeBookings.length, jobs: activeBookings });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching assigned jobs." });
  }
};

// 4. Update Booking Status (Guide action: 'Confirmed', 'Cancelled', 'Completed')
exports.updateBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body; // 'Confirmed', 'Cancelled', 'Completed'

    const validStatuses = ['Pending Confirmation', 'Confirmed', 'Cancelled', 'Completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value." });
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      { status },
      { new: true }
    );

    if (!updatedBooking) {
      return res.status(404).json({ success: false, message: "Booking record not found." });
    }

    res.json({
      success: true,
      message: `Booking updated to '${status}' successfully!`,
      booking: updatedBooking
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
