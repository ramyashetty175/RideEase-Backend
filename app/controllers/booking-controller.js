const Booking = require('../models/booking-model');
const Notification = require('../models/notification-model');
const User = require('../models/user-Authmodel');
const { BookingValidation, BookingAvailabilityValidation, BookingApproveValidation } = require('../validations/booking-validations');
const { message } = require('../validations/vehicleTracking-validations');

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

bookingsCtlr.checkAvailability = async (req, res) => { 
    const body = req.body;
    const { error, value } = BookingAvailabilityValidation.validate(body, { abortEarly: false });
    if(error) {
        return res.status(400).json({ error: error.details });
    }
    try {
        const overlappingBooking = await Booking.findOne({ vehicle: value.vehicle, startDate: value.startDate, endDate: value.endDate });
        if(overlappingBooking) {
           res.json({ message: 'Vehicle is not avialable for selected Dates' });
        }
        res.json({ message: 'Vehicle is availbale for booking' });
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}

bookingsCtlr.approve = async (req, res) => {
    const body = req.body;
    const id = req.params.id;
    const { error, value } = BookingApproveValidation.validate(body);
    if(error) {
        return res.status(400).json({ error: error.details });
    }
    try {
        const booking = await Booking.findOneAndUpdate({ _id: id }, value, { new: true });
        if(!booking) {
           return res.status(404).json({ error: 'record not found' });
        }
        const owner = await User.findOne({ user: owner });
        if(owner) {
           bookingStatus = "Approved";
        }
        booking.pickupTime = value.pickupTime;
        booking.returnTime = value.returnTime;
        await booking.save();
        res.json(booking);
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}

bookingsCtlr.confirm = async (req, res) => {
    const body = req.body;
    const id = req.params.id;
    const { error, value } = BookingApproveValidation.validate(body);
    if(error) {
        return res.status(400).json({ error: error.details });
    }
    try {
        const booking = await Booking.findByIdAndUpdate({ _id: id }, value, { new: true });
        if(booking) {
            return res.status(404).json({ error: 'record not found' });
        }
        booking.paymentStatus = "Paid";
        await booking.save();
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
        if(!booking) {
            return res.status(404).json({ error: 'record not found' });
        }
        booking.bookingStatus = "in-progress";
        booking.startTrip = new Date();
        booking.vehicle.avialabilityStatus = "Booked";
        await booking.save();
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
        booking.bookingStatus = "Completed";
        booking.endTrip = new Date();
        booking.vehicle.avialabilityStatus = "Available";
        await booking.save();
        res.json(booking);
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}

bookingsCtlr.cancel = async (req, res) => { p
    const body = req.body;
    const { error, value } = BookingValidation.validate(body);
    if(error) {
        return res.status(400).json({ error: error.details });
    }
    try {
        const booking = await Booking.findOne({ bookingStatus: Pending || confirmed });
        if(!booking) {
            res.json({ message: 'you cannot cancel the booking' });
        }
        booking.bookingStatus = "Cancel";
        await booking.save();
        res.json(booking);
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}

bookingsCtlr.extend = async (req, res) => {
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
        booking.endDate = new Date();
        booking.bookingStatus = "in-progress";
        await booking.save();
        res.json(booking);
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}

module.exports = bookingsCtlr;