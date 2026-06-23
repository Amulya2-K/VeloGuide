const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  touristName: { type: String, required: true },
  guideId: { type: mongoose.Schema.Types.ObjectId, ref: 'Guide', required: true },
  guideName: { type: String, required: true },
  destination: { type: String, required: true },
  policeClearanceId: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  status: { type: String, default: 'Pending Local Guide Confirmation' }
});

module.exports = mongoose.model('Booking', BookingSchema);