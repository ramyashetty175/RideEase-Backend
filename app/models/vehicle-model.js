const mongoose = require('mongoose');

const VehicleSchema = new mongoose.Schema({
    owner: {
        type: String,
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
    license: {
        type: String, 
        required: true
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
    images: [
        {
            type: String
        }
    ],
    availabilityStatus: {
        type: String,
        enum: ["Available", "Booked", "Maintainance"],
        default: "Available"
    },
    averageRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    }
}, { timestamps: true });

const Vehicle = mongoose.model('Vehicle', VehicleSchema);

module.exports = Vehicle;
