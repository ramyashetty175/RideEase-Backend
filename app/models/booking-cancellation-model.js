const mongoose = require('mongoose');

const bookingCancellationSchema = new mongoose.Schema({
    bookingId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Booking'
    },
    vehicleId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Vehicle'
    },
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    canceledBy: {
        type: String,
        enum: ["customer", "owner", "admin"]
    },
    reason: String,
    cancelledAt: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending"
    },
    refundAmount: {
        type: Number,
        default: 0
    }, 
    penaltyAmount: {
        type: Number,
        default: 0
    },
    paymentStatus: {
        type: String,
        enum: ["not_processed", "refunded", "failed"],
        default: "not_processed"
    },
    remarks: String
}, { timestamps: true });

const BookingCancellation = mongoose.model('BookingCancellation', bookingCancellationSchema);

module.exports = BookingCancellation;