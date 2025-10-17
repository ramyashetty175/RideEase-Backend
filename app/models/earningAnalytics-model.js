const mongoose = require('mongoose');

const EarningAnalyticsSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    totalEarnings: {
        type: Number,
        default: 0
    },
    totalBookings: {
        type: Number,
        default: 0
    },
    averageRating: {
        type: Number,
        default: 0
    }, 
    reportPeriod: {
        type: String,
        enum: ["Daily", "Weekly", "Monthly"],
        default: "Monthly"
    },
    topVehicle: {
        type: mongoose.Schema.ObjectId,
        ref: 'Vehicle'
    },
    dateRange: {
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
    }
}, { timeseries: true });

const EarningAnalytics = mongoose.model('EarningAnalytics', EarningAnalyticsSchema);

module.exports = EarningAnalytics;
