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
        const existingBooking = await Booking.find({ vehicle: value.vehicle });
        const overlappingBooking = existingBooking.find( b=> (b.bookingStatus == "Approved" || b.bookingStatus == "in-progress") && b.startDate <= value.endDate && b.endDate >= value.startDate);
        if(overlappingBooking) {
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

bookingsCtlr.checkAvailability = async (req, res) => {  
    const body = req.body; 
    const { error, value } = BookingAvailabilityValidation.validate(body, { abortEarly: false });
    if(error) {
        return res.status(400).json({ error: error.details });
    }
    try {
        const existingBooking = await Booking.find({ vehicle: value.vehicle });
        const overlappingBooking = existingBooking.find( b => (b.bookingStatus == "Approved" || b.bookingStatus == "in-progress") && b.startDate <= value.endDate && b.endDate >= value.startDate);
        if(overlappingBooking) {
           return res.json({ message: 'Vehicle is not available for selected Dates' });
        }
        res.json({ message: 'Vehicle is available for booking' });
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
        let booking;
        if(req.role == "admin") {
            booking = await Booking.findById(id);
        } else if(req.role == "owner") {
            booking = await Booking.findOne({ _id: id, owner: req.userId });
        }
        if(!booking) {
           return res.status(404).json({ error: 'record not found' });
        }
        booking.bookingStatus = "Approved";
        booking.pickupTime = value.pickupTime;
        booking.returnTime = value.returnTime;
        await booking.save();
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
        const booking = await Booking.findById(id);
        if(!booking) {
            return res.status(404).json({ error: 'record not found' });
        }
        booking.paymentStatus = "Paid";
        await booking.save();
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
        const vehicle = await Vehicle.findById(booking.vehicle);
        if(vehicle) {
            vehicle.availabilityStatus = "Booked";
            await vehicle.save();
        }
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
        const booking = await Booking.findById(id);
        if(!booking) {
           return res.status(404).json({ error: 'record not found' });
        }
        if(booking.bookingStatus !== "in-progress") {
            return res.status(400).json({ error: "only in-progress bookings can be ended" });
        }
        booking.bookingStatus = "Completed";
        booking.endTrip = new Date();
        const vehicle = await Vehicle.findById(booking.vehicle);
        if(vehicle) {
            vehicle.availabilityStatus = "Available";
            await vehicle.save();
        }
        await booking.save();
        res.json({ message: "trip ended successfully", booking });
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}

bookingsCtlr.cancel = async (req, res) => { 
    const body = req.body;
    const id = req.params.id;
    const { error, value } = BookingValidation.validate(body);
    if(error) {
        return res.status(400).json({ error: error.details });
    }
    try {
        const booking = await Booking.findById(id);
        if(!booking) {
            return res.status(404).json({ message: 'record not found' });
        }
        if(booking.bookingStatus !== "Pending" && booking.bookingStatus !== "Confirmed") {
            return res.status(400).json({ message: "You cannot cancel this booking" });
        }
        booking.bookingStatus = "Cancelled";
        const vehicle = await Vehicle.findById(booking.vehicle);
        if(vehicle) {
            vehicle.availabilityStatus = "Available";
            await vehicle.save();
        }
        await booking.save();
        res.json({ message: "booking Cancelled successfully", booking });
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
        const booking = await Booking.findById(id);
        if(!booking) {
           return res.status(404).json({ error: 'record not found' });
        }
        if(booking.bookingStatus !== "in-progress" && booking.bookingStatus !== "Approved") {
           return res.status(400).json({ message: "Only in-progress and Approved booking can be extended" });
        }
        booking.endDate = value.endDate || new Date();
        booking.bookingStatus = "in-progress";
        await booking.save();
        res.json({ message: "Booking extended successfullly", booking });
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}

module.exports = bookingsCtlr;