const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
    orderId: String,
    amount: Number,
    status: {
        type: String,
        enum: ["created", "paid", "failed", "refunded"],
    },
    booking: {
        type: mongoose.Schema.ObjectId,
        ref: 'Booking'
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    transactionId: {
        type: String,
        unique: true,
    },
}, { timestamps: true });

const Payment = mongoose.model('Payment', PaymentSchema);

module.exports = Payment;