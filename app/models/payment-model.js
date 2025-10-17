const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
    booking: {
        type: mongoose.Schema.ObjectId,
        ref: 'Booking'
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    amount: Number,
    paymentMethod: {
        type: String,
        enum: ["Card", "UPI", "Wallet", "NetBanking", "Cash"]
    },
    transactionId: {
        type: String,
        unique: true //
    },
    paymentStatus: {
        type: String,
        enum: ["Pending", "Completed", "Failed", "Refunded"],
        default: "Pending"
    },
    refundAmount: {
        type: Number,
        default: 0
    },
    refundStatus: {
        type: String,
        enum: ["Not Requested", "Requested", "Processed"],
        default: "Not Requested"
    }
}, { timestamps: true });

const Payment = mongoose.model('Payment', PaymentSchema);

module.exports = Payment;