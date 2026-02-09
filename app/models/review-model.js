const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    vehicle: {
        type: mongoose.Schema.ObjectId,
        ref: 'Vehicle',
        required: true
    },
    booking: {
        type: mongoose.Schema.ObjectId,
        ref: 'Booking',
        required: true
    },
    rating: { 
        type: Number, 
        min: 1, 
        max: 5,
        default: null
    },
}, { timestamps: true });

const Review = mongoose.model('Review', ReviewSchema);

module.exports = Review;