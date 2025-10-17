const Review = require('../models/review-model');
const ReviewValidations = require('../validations/review-validations');

const reviewCtlr = {};

reviewCtlr.create = async(req, res) => {
    const body = req.body;
    const { error, value } = ReviewValidations.validate(body, { abortEarly: false });
    if(error) {
        return res.status(400).json({ error: error.details });
    }
    try {
        const review = new Review();
        review.user = req.userId;
        review.vehicle = value.vehicle;
        review.rating = value.rating;
        review.comment = value.comment;
        await review.save();
        res.status(201).json(review);
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}

reviewCtlr.show = async(req, res) => {
    const id = req.params.id;
    try {
        const review = await Review.findOne({ _id: id, user: req.userId });
        if(!review) {
           return res.status(404).json({ error: 'record not found' });
        }
        res.json(review);
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}

reviewCtlr.list = async(req, res) => {
    try {
        const review = await Review.find({ user: req.userId });
        if(!review) {
           return res.status(404).json({ error: 'record not found' });
        }
        res.json(review);
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}

reviewCtlr.update = async(req, res) => {
    const body = req.body;
    const id = req.params.id;
    const { error, value } = ReviewValidations.validate(body);
    if(error) {
        return res.status(400).json({ error: error.details });
    }
    try {
        const review = await Review.findOneAndUpdate({ _id: id, user: req.userId }, value, { new: true });
        if(!review) {
            return res.status(404).json({ error: 'record not found' });
        }
        res.json(review);
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}

reviewCtlr.remove = async(req, res) => {
    try {
        const review = await Review.findOneAndDelete({ _id: id, user: req.userId });
        if(!review) {
           return res.status(404).json({ error: 'record not found' });
        }
        res.json(review);
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}

module.exports = reviewCtlr;