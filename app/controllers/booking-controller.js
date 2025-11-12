const Booking = require('../models/booking-model');
const Vehicle = require('../models/vehicle-model');
const { BookingValidation, BookingAvailabilityValidation, BookingApproveValidation } = require('../validations/booking-validations');

const bookingsCtlr = {};

bookingsCtlr.create = async(req, res) => {
    const body = req.body;
    const { error, value } = BookingValidation.validate(body, { abortEarly: false });
    if(error) {
        return res.status(400).json({ error: error.details });
    }
    try {
        const existingBooking = await Booking.findOne({ vehicle: value.vehicle, startDate: value.startDate, user: req.userId }); //
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
        await booking.save();
        res.status(201).json({ message: "booking created successfully", booking });
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}

bookingsCtlr.show = async(req, res) => { 
    const id = req.params.id;
    try {
        let booking;
        if(req.role == "admin") {
           booking = await Booking.findById(id);
        } else if(req.role == "owner") {
           booking = await Booking.findOne({ _id: id, owner: req.userId });
        }
        else {
           booking = await Booking.findOne({ _id: id, user: req.userId });
        }
        if(!booking) {
            return res.status(404).json({ error: 'record not found' });
        }
        res.json(booking);
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}

bookingsCtlr.listBookings = async(req, res) => { 
    try {
        let bookings;
        if(req.role == "admin") {
            bookings = await Booking.find();
        } else if(req.role == "owner") {
            bookings = await Booking.find({ owner: req.userId });
        }
        else {
            bookings = await Booking.find({ user: req.userId });
        }
        res.json(bookings);
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
        let booking;
        if(req.role == "admin") {
            booking = await Booking.findByIdAndUpdate(id, value, { new: true });
        } else if(req.role == "owner") {
            booking = await Booking.findOneAndUpdate({ _id: id, owner: req.userId }, value, { new: true });
        } else {
            booking = await Booking.findOneAndUpdate({ _id: id, user: req.userId }, value, { new: true });
        }
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
        let booking;
        if(req.role == "admin") {
           booking = await Booking.findByIdAndDelete(id);
        } else if(req.role == "owner") {
            booking = await Booking.findOneAndDelete({ _id: id, owner: req.userId });
        }
        else {
           booking = await Booking.findOneAndDelete({ _id: id, user: req.userId });
        }
        if(!booking) {
            return res.status(404).json({ error: 'record not found' });
        }
        res.json({ message: "booking deleted successfully", booking });
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}

bookingsCtlr.checkAvailability = async (req, res) => {  //
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
        const updatedData = {
            ...value,
            bookingStatus: "Approved",
            pickupTime: value.pickupTime,
            returnTime: value.returnTime
        }
        let booking;
        if(req.role == "admin") {
            booking = await Booking.findByIdAndUpdate(id, updatedData, { new: true });
        } else if(req.role == "owner") {
            booking = await Booking.findOneAndUpdate({ _id: id, owner: req.userId }, updatedData, { new: true });
        }
        if(!booking) {
           return res.status(404).json({ error: 'record not found' });
        }
        res.json({ message: "booking Approved successfully", booking });
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
        const updatedData = {
            ...value,
            paymentStatus: "Paid"
        }
        const booking = await Booking.findByIdAndUpdate(id, updatedData, { new: true });
        if(!booking) {
            return res.status(404).json({ error: 'record not found' });
        }
        res.json({ message: "Booking confirmed successfully", booking });
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
        const booking = await Booking.findById(id);
        if(!booking) {
            return res.status(404).json({ error: 'record not found' });
        }
        if(booking.bookingStatus !== "Approved") {
           return res.status(400).json({ error: "only approved booking can be started" });
        }
        booking.bookingStatus = "in-progress";
        booking.startTrip = new Date();
        await Vehicle.findByIdAndUpdate(booking.vehicle, { avialabilityStatus: "Booked" } );
        await booking.save();
        res.json({ message: "trip started successfully", booking });
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