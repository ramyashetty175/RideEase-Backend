const mongoose = require('mongoose');

const vehicleTrackingSchema = new mongoose.Schema({
    vehicleId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Vehicle'
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

const vehicleTracking = mongoose.model('vehicleTracking', vehicleTrackingSchema);

module.exports = vehicleTracking;
