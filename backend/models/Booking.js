const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  touristId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  touristName: { type: String, required: true },
  touristEmail: { type: String, default: '' },
  touristPhone: { type: String, default: '' },
  guideId: { type: mongoose.Schema.Types.ObjectId, ref: 'Guide', required: true },
  guideName: { type: String, required: true },
  destination: { type: String, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String, default: '' },
  hoursPerDay: { type: Number, default: 4 },
  totalPrice: { type: Number, default: 2000 },
  specialRequests: { type: String, default: '' },
  status: { type: String, default: 'Pending Confirmation' }, // 'Pending Confirmation', 'Confirmed', 'Completed', 'Cancelled'
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', BookingSchema);