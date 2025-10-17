const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    planType: {
        type: String,
        enum: ["Basic", "Silver", "Gold", "Platinum"]
    },
    price: Number, 
    startDate: {
        type: Date,
        default: Date.now()
    },
    endDate: Date, //
    isActive: {
        type: Boolean,
        default: true
    },
    features: [
        { 
           type: String
        }
    ],
    paymentStatus: {
        type: String,
        enum: ["Pending", "Completed", "Failed"],
        default: "Pending"
    }
}, { timeseries: true });

const Subscription = mongoose.model('Subscription', SubscriptionSchema);

module.exports = Subscription;