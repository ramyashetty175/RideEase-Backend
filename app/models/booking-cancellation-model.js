const mongoose = require('mongoose');

const bookingCancellationSchema = new mongoose.Schema({

}, { timestamps: true });

const BookingCancellation = mongoose.model('BookingCancellation', bookingCancellationSchema);

module.exports = BookingCancellation;