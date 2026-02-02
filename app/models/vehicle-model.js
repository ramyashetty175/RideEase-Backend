const mongoose = require('mongoose');

const VehicleSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    vehicleName: String,
    brand: String,
    type: {
        type: String,
        enum: ["Car", "Bike"]
    }, 
    registrationNumber: {
        type: String,
        unique: true
    },
    licenseDoc: {
        type: String, 
        default: null
    },
    insuranceDoc: {
        type: String,
        default: null
    },
    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending"
    },
    fuelType: {
        type: String,
        enum: ["Petrol", "Diesel", "Electric"]
    },
    transmission: {
        type: String,
        enum: ["Manual", "Electric"]
    },
    seats: Number,
    pricePerDay: Number,
    location: {
    type: {
      type: String,
      enum: ["Point"],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
    },
    image: {
        type: String,
        required: true
    },
    availabilityStatus: {
        type: String,
        enum: ["Available", "Booked", "Maintainance", "unAvailable"],
        default: "unAvailable"
    },
    ratings: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      rating: { type: Number, min: 1, max: 5 },
      createdAt: { type: Date, default: Date.now }
    }
    ]
}, { timestamps: true });

VehicleSchema.index({ location: "2dsphere" });

const Vehicle = mongoose.model('Vehicle', VehicleSchema);

module.exports = Vehicle;