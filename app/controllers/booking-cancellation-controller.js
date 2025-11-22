const BookingCancellation = require('../models/booking-cancellation-model');
const Vehicle = require('../models/vehicle-model');
const Booking = require('../models/booking-model');
const { BookingCancellationValidation, BookingCancelValidation } = require('../validations/booking-cancellation-validations');

const bookingCancellationCtlr = {};

bookingCancellationCtlr.requestCancel = async(req, res) => {
    const body = req.body;
    const id = req.params.id;
    const { error, value } = BookingCancellationValidation.validate(body, { abortEarly: false });
    if(error) {
       return res.status(400).json({ error: error.details });
    }
    try {
        const booking = await Booking.findOne({ _id: id, user: req.userId });
        if(!booking) {
            return res.status(404).json({ error: 'Booking not found or not allowed' });
        }
        if(booking.bookingStatus === "completed" || booking.bookingStatus === "cancelled") {
            return res.status(400).json({ error: "Cannot cancel a completed or cancelled booking" });
        }
        const existingRequest = await BookingCancellation.findOne({ bookingId: id, status: 'pending' });
        if(existingRequest) {
            return res.status(400).json({ error: 'Cancellation request already pending' });
        }
        const bookingcancellation = new BookingCancellation();
        bookingcancellation.bookingId = booking._id;
        bookingcancellation.vehicleId = booking.vehicle;
        bookingcancellation.userId = req.userId;
        bookingcancellation.canceledBy = "customer";
        bookingcancellation.reason = value.reason;
        await bookingcancellation.save();
        booking.bookingStatus = "CancelRequested";
        await booking.save();
        res.status(201).json({ message: "Cancellation request submitted successfully", bookingcancellation });
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}

bookingCancellationCtlr.show = async(req, res) => {
    const id = req.params.id;
    try {
        let bookingcancellation;
        if(req.role == "admin") {
            bookingcancellation = await BookingCancellation.findById(id);
        } else if(req.role == "owner") {
            bookingcancellation = await BookingCancellation.findOne({ _id: id, owner: req.userId }); 
            if(!bookingcancellation) {
               return res.status(403).json({ error: 'You are not allowed to see this cancellation record or record does not exists' });
            }
        } else {
            bookingcancellation = await BookingCancellation.findOne({ _id: id, user: req.userId });
            if(!bookingcancellation.length) {
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

bookingCancellationCtlr.approveCancel = async (req, res) => {
    const body = req.body;
    const id = req.params.id;
    const { error, value } = BookingCancelValidation.validate(body);
    if(error) {
        return res.status(400).json({ error: error.details });
    }
    try {
        let bookingcancellation;
        if(req.role == 'admin') {
           bookingcancellation = await BookingCancellation.findById(id);
        } else {
            bookingcancellation = await BookingCancellation.findOne({ _id: id, owner: req.userId });
            if(!bookingcancellation) {
               return res.status(404).json({ error: 'You cannot cancel this booking or Cancellation request not found' });
            }
        }
        if(!bookingcancellation) {
            return res.status(404).json({ error: 'Cancellation request not found' });
        }
        if(bookingcancellation.status !== "pending") {
           return res.status(400).json({ error: "This request has already been processed" });
        }
        bookingcancellation.status = value.status;
        bookingcancellation.reason = value.reason;
        bookingcancellation.remarks = value.remarks;
        if(value.status == "approved") {
            const booking = await Booking.findById(bookingcancellation.bookingId);
            if(booking) {
               booking.bookingStatus = "Canceled";
               await booking.save();
            }
            const vehicle = await Vehicle.findById(booking.vehicle);
            if(vehicle) {
               vehicle.availabilityStatus = "Available";
               await vehicle.save();
            }
            bookingcancellation.paymentStatus = "refunded";
        }
        await bookingcancellation.save();
        res.json({ message: `cancellation ${value.status} successfully`, bookingcancellation });
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}

module.exports = bookingCancellationCtlr;