const mongoose = require('mongoose');

const VehicleTrackingSchema = new mongoose.Schema({
    vehicle: {
        type: mongoose.Schema.ObjectId,
        ref: 'Vehicle'
    },
    booking: {
        type: mongoose.Schema.ObjectId,
        ref: 'Booking'
    },
    latitude: Number,
    longitude: Number,
    speed: {
        type: Number,
        default: 0
    },
    maxSpeed: {
        type: Number,
        default: 0
    },
    avgSpeed: {
        type: Number,
        default: 0
    },
    distanceTravelled: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ["moving", "parked", "offline"],
        default: "moving"
    },
    isLive: {
        type: Boolean,
        default: true
    },
    lastUpdatedAt: {
        type: Date,
        default: Date.now()
    }
}, { timestamps: true })

const VehicleTracking = mongoose.model('VehicleTracking', VehicleTrackingSchema);

module.exports = VehicleTracking;