const { required } = require('joi');
const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    vehicle: {
        type: mongoose.Schema.ObjectId,
        ref: 'Vehicle'
    },
    rating: Number, //
    comment: String
}, { timestamps: true });

const Review = mongoose.model('Review', ReviewSchema);

module.exports = Review;