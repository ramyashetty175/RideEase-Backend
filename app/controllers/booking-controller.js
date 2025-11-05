const Booking = require('../models/booking-model');
const Notification = require('../models/notification-model');
const User = require('../models/user-Authmodel');
const { findOneAndUpdate } = require('../models/vehicleTracking-model');
const BookingValidation = require('../validations/booking-validations');

const bookingsCtlr = {};

bookingsCtlr.create = async(req, res) => {
    const body = req.body;
    const { error, value } = BookingValidation.validate(body, { abortEarly: false });
    if(error) {
        return res.status(400).json({ error: error.details });
    }
    try {
        const existingBooking = await Booking.findOne({ vehicle: value.vehicle, startDate: value.startDate, user: req.userId });
        if(existingBooking) {
            return res.status(400).json({ error: 'Vehicle is not available for the selected dates' });
        }
        const booking = new Booking();
        booking.user = req.userId;
        booking.vehicle = value.vehicle;
        booking.startDate = value.startDate;
        booking.endDate = value.endDate;
        booking.pickupLocation = value.pickupLocation;
        booking.returnLocation = value.returnLocation;
        booking.totalAmount = value.totalAmount;
        booking.paymentStatus = value.paymentStatus;
        booking.bookingStatus = value.bookingStatus;
        await booking.save();
        res.status(201).json(booking);
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}

bookingsCtlr.show = async(req, res) => {
    const id = req.params.id;
    try {
        const booking = await Booking.findOne({ _id: id, user: req.userId });
        if(!booking) {
            return res.status(404).json({ error: 'record not found' });
        }
        res.json(booking);
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}

bookingsCtlr.list = async(req, res) => {
    try {
        const booking = await Booking.find({ user: req.userId });
        if(!booking) {
            return res.status(404).json({ error: 'record not found' });
        }
        res.json(booking);
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}

bookingsCtlr.update = async(req, res) => {
    const body = req.body;
    const id = req.params.id;
    const { error, value } = BookingValidation.validate(body);
    if(error) {
        return res.status(400).json({ error: error.details });
    }
    try {
        const booking = await Booking.findOneAndUpdate({ _id: id, user: req.userId }, value, { new: true });
        if(!booking) {
           return res.status(404).json({ error: 'record not found' });
        }
        res.json(booking);
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}

bookingsCtlr.remove = async(req, res) => {
    const id = req.params.id;
    try {
        const booking = await Booking.findOneAndDelete({ _id: id, user: req.userId });
        if(!booking) {
            return res.status(404).json({ error: 'record not found' });
        }
        res.json(booking);
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}

bookingsCtlr.checkAvailability = async (req, res) => { p
    const body = req.body;
    const { error, value } = BookingValidation.validate(body, { abortEarly: false });
    if(error) {
        return res.status(400).json({ error: error.details });
    }
    try {
        
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}

bookingsCtlr.approve = async (req, res) => {
    const body = req.body;
    const id = req.params.id;
    const { error, value } = BookingValidation.validate(body);
    if(error) {
        return res.status(400).json({ error: error.details });
    }
    try {
        const booking = await findOneAndUpdate({ _id: id }, value, { new: true });
        if(!booking) {
           return res.status(404).json({ error: 'record not found' });
        }
        res.json(booking);
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}

bookingsCtlr.confirmBooking = async (req, res) => {
    const body = req.body;
    const id = req.params.id;
    const { error, value } = BookingValidation.validate(body);
    if(error) {
        return res.status(400).json({ error: error.details });
    }
    try {
        const booking = await Booking.findByIdAndUpdate({ _id: id }, value, { new: true });
        if(booking) {
            return res.status(404).json({ error: 'record not found' });
        }
        res.json(booking);
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}

bookingsCtlr.startTrip = async (req, res) => {
    const body = req.body;
    const id = req.params.id;
    const { error, value } = BookingValidation.validate(body);
    if(error) {
        return res.status(400).json({ error: error.details });
    }
    try {
        const booking = await Booking.findOneAndUpdate({ _id: id }, value, { new: true });
        if(booking) {
            return res.status(404).json({ error: 'record not found' });
        }
        res.json(booking);
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}

bookingsCtlr.endTrip = async(req, res) => {
    const body = req.body;
    const id = req.params.id;
    const { error, value } = BookingValidation.validate(body);
    if(error) {
        return res.status(400).json({ error: error.details });
    }
    try {
        const booking = await Booking.findOneAndUpdate({ _id: id }, value, { new: true });
        if(!booking) {
           return res.status(404).json({ error: 'record not found' });
        }
        res.json(booking);
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}

bookingsCtlr.cancelBooking = async (req, res) => { p
    const body = req.body;
    try {
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}

bookingsCtlr.extendBooking = async (req, res) => {
    const body = req.body;
    const id = req.params.id;
    const { error, value } = BookingValidation.validate(body);
    if(error) {
        return res.status(400).json({ error: error.details });
    }
    try {
        const booking = await Booking.findOneAndUpdate({ _id: id }, value, { new: true });
        if(!booking) {
           return res.status(404).json({ error: 'record not found' });
        }
        res.json(booking);
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}

module.exports = bookingsCtlr;