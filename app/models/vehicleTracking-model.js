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
    status: {
        type: String,
        enum: ["moving", "parked", "offline"],
        default: "moving"
    }
}, { timestamps: true })

const vehicleTracking = mongoose.model('vehicleTracking', vehicleTrackingSchema);

module.exports = vehicleTracking;
