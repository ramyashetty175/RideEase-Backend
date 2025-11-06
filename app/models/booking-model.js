const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    vehicle: {
        type: mongoose.Schema.ObjectId,
        ref: 'Vehicle'
    },
    startDate: Date,
    endDate: Date,
    pickupLocation: String,
    returnLocation: String,
    totalAmount: Number,
    paymentStatus: {
       type: String,
       enum: ["Pending", "Paid", "Refunded"],
       default: "Pending"
    },
    bookingStatus: {
        type: String,
        enum: ["Pending", "Approved", "Confirmed", "in-progress", "Completed", "Canceled"],
        default: "Pending"
    },
    pickupTime: String,
    returnTime: String
}, { timestamps: true });

const Booking = mongoose.model('Booking', BookingSchema);

module.exports = Booking;