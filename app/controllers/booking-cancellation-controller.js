const BookingCancellation = require('../models/booking-cancellation-model');
const User = require('../models/user-Authmodel');
const Booking = require('../models/booking-model');
const BookingCancellationValidation = require('../validations/booking-cancellation-validations');

const bookingCancellationCtlr = {};

bookingCancellationCtlr.requestCancel = async(req, res) => {
    const body = req.body;
    const bookingId = req.params.id;
    const { error, value } = BookingCancellationValidation.validate(body, { abortEarly: false });
    if(error) {
       return res.status(400).json({ error: error.details });
    }
    try {
        const booking = await Booking.findOne({ _id: bookingId, user: req.userId });
        if(!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }
        const existingRequest = await BookingCancellation.findOne({ bookingId, status: 'pending' });
        if(existingRequest) {
            return res.status(400).json({ error: 'Cancellation request already pending' });
        }
        const bookingcancellation = new BookingCancellation();
        bookingcancellation.canceledBy = value.canceledBy;
        bookingcancellation.reason = value.reason;
        bookingcancellation.cancelledAt = new Date();
        bookingcancellation.status = value.status;
        bookingcancellation.refundAmount = value.refundAmount;
        bookingcancellation.penaltyAmount = value.penaltyAmount;
        bookingcancellation.paymentStatus = value.paymentStatus;
        bookingcancellation.remarks =  value.remarks;
        await bookingcancellation.save();
        booking.bookingStatus = "Pending";
        res.status(201).json({ message: "Cancellation request submitted successfully", bookingcancellation });
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