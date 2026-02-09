const Booking = require('../models/booking-model');
const Vehicle = require('../models/vehicle-model');
const User = require('../models/user-Authmodel');
const { BookingValidation } = require('../validations/booking-validations');

const bookingsCtlr = {};

// Booking Create
bookingsCtlr.create = async(req, res) => {
    const body = req.body;
    const { error, value } = BookingValidation.validate(body, { abortEarly: false });
    if(error) {
        return res.status(400).json({ error: error.details });
    }
    try {
        const vehicle = await Vehicle.findById(value.vehicle);
        if(!vehicle) {
            return res.status(404).json({ error: 'Vehicle not found' });
        }
        const newStart = new Date(value.startDateTime);
        const newEnd   = new Date(value.endDateTime);
        const userDuplicate = await Booking.findOne({
            user: req.userId,
            vehicle: value.vehicle,
            bookingStatus: { $in: ["pending", "approved", "confirmed", "in-progress"] },
            startDateTime: { $lt: newEnd },
            endDateTime: { $gt: newStart }
        });
        if (userDuplicate) {
            return res.status(400).json({ error: 'You already booked this vehicle for these dates or Time' });
        }
        const overlappingBooking = await Booking.findOne({
            vehicle: value.vehicle,
            bookingStatus: { $in: ["approved", "confirmed", "in-progress"] },
            startDateTime: { $lt: newEnd  },
            endDateTime: { $gt: newStart }
        });
        if (overlappingBooking) {
            return res.status(400).json({ error: 'Vehicle is not available for the selected dates' });
        }
        const booking = new Booking();
        booking.user = req.userId;
        booking.vehicle = value.vehicle;
        booking.owner = vehicle.owner;
        booking.startDateTime = newStart;
        booking.endDateTime = newEnd;
        booking.pickupLocation = value.pickupLocation;
        booking.returnLocation = value.returnLocation;
        await booking.save();
        res.status(201).json({ message: "booking created successfully", booking });
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}

// Bookings List
bookingsCtlr.listBookings = async(req, res) => { 
    try {
        let bookings;
        if(req.role == "admin") {
            bookings = await Booking.find().populate("user", "username licenceDoc insuranceDoc").populate("vehicle", "image");
        } else if(req.role == "owner") {
            bookings = await Booking.find({ owner: req.userId }).populate("user", "username licenceDoc insuranceDoc").populate("vehicle", "image");
            if(bookings.length == 0) {
                return res.status(403).json({ error: 'You are not allowed to see this bookings or bookings not exists' });
            }
        }
        else {
            bookings = await Booking.find({ user: req.userId }).populate("user", "name licenceDoc insuranceDoc").populate("vehicle", "image");
            if(bookings.length == 0) {
               return res.status(403).json({ error: 'You are not allowed to see this bookings or bookings not exists' });
            }
        }
        if(!bookings) {
            return res.status(404).json({ error: 'You are not allowed to see this bookings or bookings not exists' });
        }
        res.json(bookings);
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}

// Booking Approve
bookingsCtlr.approve = async (req, res) => {
    const id = req.params.id;
    try {
        let booking;
        if(req.role == "admin") {
            booking = await Booking.findById(id);
        } else if(req.role == "owner") {
            booking = await Booking.findOne({ _id: id, owner: req.userId });
            if(!booking) {
                return res.status(403).json({ error: 'You are not authorized to approve this vehicle or record not exists' });
            }
        }
        if(!booking) {
           return res.status(404).json({ error: 'record not found' });
        }
        const user = await User.findById(booking.user);
        if(!user) {
            return res.status(404).json({ error: "User not found" });
        }
        if(!user.licenceDoc || !user.insuranceDoc) {
            return res.status(400).json({ error: "User has not uploaded Licence or Insurance documents" });
        }
        if(booking.paymentStatus == 'paid') {
           booking.bookingStatus = "confirmed";
        }
        await booking.save();
        res.json({ message: "booking Approved successfully", booking });
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}

// Booking Cancel
bookingsCtlr.cancel = async (req, res) => {
    const id = req.params.id;
    try {
        let booking;
        if(req.role == "admin") {
            booking = await Booking.findById(id);
        } else if(req.role == "owner") {
            booking = await Booking.findOne({ _id: id, owner: req.userId });
            if(!booking) {
                return res.status(403).json({ error: 'You are not authorized to approve this vehicle or record not exists' });
            }
        }
        if(!booking) {
           return res.status(404).json({ error: 'record not found' });
        }
        const user = await User.findById(booking.user);
        if(!user) {
            return res.status(404).json({ error: "User not found" });
        }
        if(booking.paymentStatus == 'failed') {
           booking.bookingStatus = "canceled";
           await booking.save();
        }
        res.json({ message: "booking Canceled successfully", booking });
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}

module.exports = bookingsCtlr;