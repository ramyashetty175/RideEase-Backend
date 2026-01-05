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
    owner: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    startDateTime: Date,
    endDateTime: Date,
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
        enum: ["pending", "approved", "confirmed", "in-progress", "completed", "canceled", "cancelRequested"],
        default: "pending"
    },
    tripStartTime: Date,
    tripEndTime: Date
}, { timestamps: true });

const Booking = mongoose.model('Booking', BookingSchema);

module.exports = Booking;