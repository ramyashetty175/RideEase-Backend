const BookingCancellation = require('../models/booking-cancellation-model');
const Vehicle = require('../models/vehicle-model');
const Booking = require('../models/booking-model');

const bookingCancellationCtlr = {};

// BookingCancel Request
bookingCancellationCtlr.requestCancel = async(req, res) => {
    const id = req.params.id;
    try {
        const booking = await Booking.findOne({ _id: id, user: req.userId });
        if(!booking) {
            return res.status(404).json({ error: 'Booking not found or not allowed' });
        }
        const vehicle = await Vehicle.findById(booking.vehicle);
        if(!vehicle) {
            return res.status(404).json({ error: 'Vehicle not found' });
        }
        if(booking.bookingStatus === "completed" || booking.bookingStatus === "canceled") {
            return res.status(400).json({ error: "Cannot cancel a completed or cancelled booking" });
        }
        if(booking.bookingStatus === "cancelRequested") {
            return res.status(400).json({ error: "Cancellation already requested" });
        }
        const existingRequest = await BookingCancellation.findOne({ bookingId: id, status: 'pending' });
        if(existingRequest) {
            return res.status(400).json({ error: 'Cancellation request already pending' });
        }
        const bookingcancellation = new BookingCancellation();
        bookingcancellation.bookingId = booking._id;
        bookingcancellation.vehicleId = vehicle._id;
        bookingcancellation.owner = vehicle.owner;
        bookingcancellation.userId = req.userId;
        await bookingcancellation.save();
        booking.bookingStatus = "cancelRequested";
        await booking.save();
        res.status(201).json({ message: "Cancellation request submitted successfully", bookingcancellation });
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}

// BookingCancel List
bookingCancellationCtlr.list = async (req, res) => {
    try {
        let bookingcancellation;
        if(req.role == 'admin') {
            bookingcancellation = await BookingCancellation.find();
        } else if(req.role == 'owner') {
            bookingcancellation = await BookingCancellation.find({ owner: req.userId });
            if(bookingcancellation.length == 0) {
               return res.status(403).json({ error: 'You are not allowed to see this cancellation record or record does not exists' });
            }
        } else {
            bookingcancellation = await BookingCancellation.find({ user: req.userId });
            if(bookingcancellation.length == 0) {
               return res.status(403).json({ error: 'You are not allowed to see this cancellation record or record does not exists' });
            }
        }
        if(!bookingcancellation) {
            return res.status(404).json({ error: 'record does not exists' });
        }
        res.json(bookingcancellation);
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}

// BookingCancel Approve
bookingCancellationCtlr.approveCancel = async (req, res) => {
    const id = req.params.id;
    try {
        let bookingcancellation;
        if(req.role == 'admin') {
           bookingcancellation = await BookingCancellation.findById(id);
        } else {
            bookingcancellation = await BookingCancellation.findOne({ _id: id, owner: req.userId });
            if(!bookingcancellation) {
               return res.status(403).json({ error: 'You cannot cancel this booking or Cancellation request not found' });
            }
        }
        if(!bookingcancellation) {
            return res.status(404).json({ error: 'Cancellation request not found' });
        }
        if(bookingcancellation.status !== "pending") {
           return res.status(400).json({ error: "This request has already been processed" });
        }
            const booking = await Booking.findById(bookingcancellation.bookingId);
            if(booking) {
               booking.bookingStatus = "canceled";
               await booking.save();
            }
            const vehicle = await Vehicle.findById(bookingcancellation.vehicleId);
            if(vehicle) {
               vehicle.availabilityStatus = "Available";
               await vehicle.save();
            }
            bookingcancellation.paymentStatus = "refunded";
        await bookingcancellation.save();
        res.json({ message: 'cancellation successfully', bookingcancellation });
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}

// BookingCancel Reject
bookingCancellationCtlr.rejectCancel = async (req, res) => {
    const id = req.params.id;
    try {
        let bookingcancellation;
        if(req.role === 'admin') {
            bookingcancellation = await BookingCancellation.findById(id);
        } else {
            bookingcancellation = await BookingCancellation.findOne({ _id: id, owner: req.userId });
            if(!bookingcancellation) {
                return res.status(403).json({ error: 'You cannot reject this cancellation request or request not found' });
            }
        }
        if(!bookingcancellation) {
            return res.status(404).json({ error: 'Cancellation request not found' });
        }
        if(bookingcancellation.status !== "pending") {
            return res.status(400).json({ error: "This request has already been processed" });
        }
        const booking = await Booking.findById(bookingcancellation.bookingId);
        if(booking) {
            booking.bookingStatus = "approved";
            await booking.save();
        }
        bookingcancellation.status = "rejected";
        bookingcancellation.paymentStatus = "not_processed";
        await bookingcancellation.save();
        res.json({ message: 'Cancellation request rejected successfully', bookingcancellation });

    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}

module.exports = bookingCancellationCtlr;