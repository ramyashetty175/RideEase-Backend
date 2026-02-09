const Review = require("../models/review-model");
const Booking = require("../models/booking-model");

const reviewCtlr = {};

reviewCtlr.addReview = async (req, res) => {
  try {
    
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Something went wrong" });
    }
}

module.exports = reviewCtlr;