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
    location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point"
    },
    coordinates: {
      type: [Number],
      required: true
    }
    },
    speed: {
    type: Number,
    default: 0
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

VehicleTrackingSchema.index({ location: '2dsphere' });

const VehicleTracking = mongoose.model('VehicleTracking', VehicleTrackingSchema);

module.exports = VehicleTracking;