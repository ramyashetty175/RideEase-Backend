const Booking = require('../models/booking-model');
const Vehicle = require('../models/vehicle-model');
const User = require('../models/user-Authmodel');
const { BookingValidation, BookingUpdateValidation, BookingAvailabilityValidation, BookingExtendValidation } = require('../validations/booking-validations');

const bookingsCtlr = {};

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
        const userDuplicate = await Booking.findOne({
            user: req.userId,
            vehicle: value.vehicle,
            startDateTime: { $lt: new Date(value.endDateTime) },
            endDateTime: { $gt: new Date(value.startDateTime) }
        });
        if (userDuplicate) {
            return res.status(400).json({ error: 'You already booked this vehicle for these dates or Time' });
        }
        const overlappingBooking = await Booking.findOne({
            vehicle: value.vehicle,
            bookingStatus: { $in: ["approved", "in-progress"] },
            startDateTime: { $lt: new Date(value.endDateTime) },
            endDateTime: { $gt: new Date(value.startDateTime) }
        });
        if (overlappingBooking) {
            return res.status(400).json({ error: 'Vehicle is not available for the selected dates' });
        }
        const booking = new Booking();
        booking.user = req.userId;
        booking.vehicle = value.vehicle;
        booking.owner = vehicle.owner;
        booking.startDateTime = value.startDateTime;
        booking.endDateTime = value.endDateTime;
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
            if(!booking) {
               return res.status(403).json({ error: 'You are not authorized to see this booking or booking not exists' });
            }
        }
        else {
            booking = await Booking.findOne({ _id: id, user: req.userId });
            if(!booking) {
               return res.status(403).json({ error: 'You are not authorized to see this booking or booking not exists' });
            }
        }
        if(!booking) {
            return res.status(404).json({ error: 'booking  not found' });
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
            if(bookings.length == 0) {
                return res.status(403).json({ error: 'You are not allowed to see this bookings or bookings not exists' });
            }
        }
        else {
            bookings = await Booking.find({ user: req.userId });
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

bookingsCtlr.update = async(req, res) => {
    const body = req.body;
    const id = req.params.id;
    const { error, value } = BookingUpdateValidation.validate(body);
    if(error) {
        return res.status(400).json({ error: error.details });
    }
    try {
        let booking;
        if(req.role == "admin") {
            booking = await Booking.findByIdAndUpdate(id, value, { new: true });
        } else if(req.role == "owner") {
            booking = await Booking.findOneAndUpdate({ _id: id, owner: req.userId }, value, { new: true });
            if(!booking) {
               return res.status(403).json({ error: 'You are not allowed to update this booking or booking not exists' });
            }
        } else {
            booking = await Booking.findOneAndUpdate({ _id: id, user: req.userId }, value, { new: true });
            if(!booking) {
               return res.status(403).json({ error: 'You are not allowed to update this booking or booking not exists' });
            }
        }
        if(!booking) {
           return res.status(404).json({ error: 'booking not found' });
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
            if(!booking) {
               return res.status(403).json({ error: 'You are not allowed to remove this booking or booking does not exists' });
            }
        }
        else {
            booking = await Booking.findOneAndDelete({ _id: id, user: req.userId });
            if(!booking) {
               return res.status(403).json({ error: 'You are not allowed to remove this booking or booking does not exists' });
            }
        }
        if(!booking) {
            return res.status(404).json({ error: 'booking does not exists' });
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
        const vehicle = await Vehicle.findById(value.vehicle);
        if (!vehicle) {
            return res.status(404).json({ error: 'Vehicle not found' });
        }
        const startDateTime = new Date(value.startDateTime);
        startDateTime.setHours(9, 0, 0, 0); 
        const endDateTime = new Date(value.endDateTime);
        endDateTime.setHours(23, 59, 59, 999);
        const overlappingBooking = await Booking.findOne({
            vehicle: value.vehicle,
            bookingStatus: { $in: ["Approved", "in-progress"] },
            startDateTime: { $lt: endDateTime },
            endDateTime: { $gt: startDateTime }
        });
        if(overlappingBooking) {
            return res.json({ available: false, message: 'Vehicle is not available for the selected date/time' });
        }
        res.json({ available: true, message: 'Vehicle is available for booking' });
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}

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
        booking.bookingStatus = "approved";
        await booking.save();
        res.json({ message: "booking Approved successfully", booking });
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}

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
        if(!user.licenceDoc || !user.insuranceDoc) {
            return res.status(400).json({ error: "User has not uploaded Licence or Insurance documents" });
        }
        booking.bookingStatus = "canceled";
        await booking.save();
        res.json({ message: "booking Canceled successfully", booking });
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}

bookingsCtlr.confirm = async (req, res) => {
    const id = req.params.id;
    try {
        let booking;
        if(req.role == 'admin') {
            booking = await Booking.findById(id);
        } else {
            booking = await Booking.findOne({ _id: id, user: req.userId });
            if(!booking) {
                return res.status(403).json({ error: 'you are not allowed to see this booking details or record not found' });
            }
        }
        if(!booking) {
            return res.status(404).json({ error: 'booking does not exists' });
        }
        // booking.paymentStatus = "Paid";
        booking.bookingStatus = "confirmed";
        const vehicle = await Vehicle.findById(booking.vehicle);
        if(vehicle) {
            vehicle.availabilityStatus = "Booked";
            await vehicle.save();
        }
        await booking.save();
        res.json({ message: "Booking confirmed successfully", booking });
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}

bookingsCtlr.startTrip = async (req, res) => {
    const id = req.params.id;
    try {
        let booking;
        if(req.role == 'admin') {
           booking = await Booking.findById(id);
        } else {
            booking = await Booking.findOne({ _id: id, user: req.userId });
            if(!booking) {
               return res.status(403).json({ error: 'You are not allowed to see this booking details or booking does not exists' });
            }
        }
        if(!booking) {
            return res.status(404).json({ error: 'record not found' });
        }
        if(booking.bookingStatus !== "Approved") {
           return res.status(400).json({ error: "only approved booking can be started" });
        }
        booking.bookingStatus = "in-progress";
        await booking.save();
        const vehicle = await Vehicle.findById(booking.vehicle);
        if(vehicle) {
            vehicle.availabilityStatus = "unAvailable";
            await vehicle.save();
        }
        res.json({ message: "trip started successfully", booking });
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}

bookingsCtlr.endTrip = async(req, res) => {
    const id = req.params.id;
    try {
        let booking;
        if(req.role == 'admin') {
           booking = await Booking.findById(id);
        } else {
            booking = await Booking.findOne({ _id: id, user: req.userId });
            if(!booking) {
               return res.status(403).json({ error: 'You are not allowed to see this booking details or booking does not exists' });
            }
        }
        if(!booking) {
           return res.status(404).json({ error: 'record not found' });
        }
        if(booking.bookingStatus !== "in-progress") {
            return res.status(400).json({ error: "only in-progress bookings can be ended" });
        }
        booking.bookingStatus = "Completed";
        await booking.save();
        const vehicle = await Vehicle.findById(booking.vehicle);
        if(vehicle) {
            vehicle.availabilityStatus = "Available";
            await vehicle.save();
        }
        res.json({ message: "trip ended successfully", booking });
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}

bookingsCtlr.extend = async (req, res) => {
    const body = req.body;
    const id = req.params.id;
    const { error, value } = BookingExtendValidation.validate(body);
    if(error) {
        return res.status(400).json({ error: error.details });
    }
    try {
        let booking;
        if(req.role == 'admin') {
            booking = await Booking.findById(id);
        } else {
            booking = await Booking.findOne({ _id: id, user: req.userId });
            if(!booking) {
               return res.status(404).json({ error: 'You are not allowed to see details of this booking or booking does not exists' });
            }
        }
        if(booking.bookingStatus !== "in-progress") {
           return res.status(400).json({ message: "Only in-progress booking can be extended" });
        }
        booking.endDateTime = value.endDateTime;
        booking.bookingStatus = "in-progress";
        await booking.save();
        const vehicle = await Vehicle.findById(booking.vehicle);
        if(vehicle) {
            vehicle.availabilityStatus = "unAvailable";
            await vehicle.save();
        }
        res.json({ message: "Booking extended successfullly", booking });
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}

module.exports = bookingsCtlr;