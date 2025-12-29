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
    isApproved: {
        type: Boolean,
        default: false
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
    location: String, //
    image: {
        type: String,
        required: true
    },
    availabilityStatus: {
        type: String,
        enum: ["Available", "Booked", "Maintainance", "unAvailable"],
        default: "unAvailable"
    },
    averageRating: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

const Vehicle = mongoose.model('Vehicle', VehicleSchema);

module.exports = Vehicle;
