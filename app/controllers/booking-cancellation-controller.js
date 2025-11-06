const BookingCancellation = require('../models/booking-cancellation-model');
const User = require('../models/user-Authmodel');
const Booking = require('../models/booking-model');
const BookingCancellationValidation = require('../validations/booking-cancellation-validations');

const bookingCancellationCtlr = {};

bookingCancellationCtlr.requestCancel = async(req, res) => {
    const body = req.body;
    const { error, value } = BookingCancellationValidation.validate(body, { abortEarly: false });
    if(error) {
       res.status(400).json({ error: error.details });
    }
    try {
        const bookingcancellation = new BookingCancellation();
        bookingcancellation.canceledBy = value.canceledBy;
        bookingcancellation.reason = value.reason;
        bookingcancellation.cancelledAt = value.cancelledAt;
        bookingcancellation.status = value.status;
        bookingcancellation.refundAmount = value.refundAmount;
        bookingcancellation.penaltyAmount = value.penaltyAmount;
        bookingcancellation.paymentStatus = value.paymentStatus;
        bookingcancellation.remarks =  value.remarks;
        await bookingcancellation.save();
        res.status(201).json(bookingcancellation);
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}

bookingCancellationCtlr.list = async(req, res) => {
    try {
        const bookingcancellation = await BookingCancellation.find({ user: req.userId });
        if(!bookingcancellation) {
           return res.status().json({ error: 'record not found' });
        }
        res.json(bookingcancellation);
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}

bookingCancellationCtlr.show = async(req, res) => {
    const id = req.params.id;
    try {
        const bookingcancellation = await BookingCancellation.findOne({ _id: id, user: req.userId });
        if(!bookingcancellation) {
            return res.status(404).json({ error: 'record not found' });
        }
        res.json(bookingcancellation);
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}

bookingCancellationCtlr.update = async(req, res) => {
    const body = req.body;
    const id = req.params.id;
    const { error, value } = BookingCancellationValidation.validate(body);
    if(error) {
        res.status(400).json({ error: error.details });
    }
    try { 
        const bookingcancellation = await BookingCancellation.findOne({ _id: id, user: req.userId }, value, { new: true });
        if(!bookingcancellation) {
           return res.status(404).json({ error: 'record not found' });
        }
        res.json(bookingcancellation);
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}

bookingCancellationCtlr.remove = async(req, res) => {
    const id = req.params.id;
    try {
        const bookingcancellation = await BookingCancellation.findOne({ _id: id, user: req.userId });
        if(!bookingcancellation) {
           return res.status(404).json({ error: 'record not found' });
        }
        res.json(bookingcancellation);
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}

bookingCancellationCtlr.approveCancel = async (req, res) => {
    const body = req.body;
    const id = req.params.id;
    const { error, value } = BookingCancellation.validate(body);
    if(error) {
        return res.status(400).json({ error: error.details });
    }
    try {
        const bookingCancellation = await BookingCancellation.findOneAndUpdate({ _id: id }, value, { new: true });
        if(!bookingCancellation) {
            return res.status(404).json({ error: 'record not found' });
        }
        const owner = await User.findOne({ user: owner });
        if(owner) {
           bookingCancellation.status = "approved";
        }
        booking.bookingStatus = "Canceled";
        Booking.save();
        await BookingCancellation.save();
        res.json(bookingCancellation);
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}

module.exports = bookingCancellationCtlr;