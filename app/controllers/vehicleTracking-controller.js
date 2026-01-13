const VehicleTracking = require('../models/vehicleTracking-model');
const VehicleTrackingValidation = require('../validations/vehicleTracking-validations');
const Booking = require('../models/booking-model');

const vehiclesTrackingCtlr = {};

// vehiclesTrackingCtlr.create = async (req, res) => {
//     const body = req.body;
//     const { error, value } = VehicleTrackingValidation.validate(body, { abortEarly: false });
//     if(error) {
//         return res.status(400).json({ error: error.details });
//     }
//     try {
//         const existvehicleTracking = await VehicleTracking({ user: req.userId });
//         const vehicletracking = new VehicleTracking();
//         vehicletracking.vehicleId = value.vehicleId;
//         vehicletracking.latitude = value.latitude;
//         vehicletracking.longitude = value.longitude;
//         vehicletracking.speed = value.speed;
//         vehicletracking.status = value.status;
//         await vehicletracking.save();
//         res.status(201).json(vehicletracking);
//     } catch(err) {
//         console.log(err);
//         res.status(500).json({ error: 'Something went wrong!!!' });
//     }
// }

vehiclesTrackingCtlr.create = async (req, res) => {
    const body = req.body;
    const { error, value } = VehicleTrackingValidation.validate(body, { abortEarly: false });
    if (error) {
        return res.status(400).json({ error: error.details });
    }
    try {
        const existVehicleTracking = await VehicleTracking.findOne({ booking: value.booking, isLive: true });
        if(existVehicleTracking) {
            return res.status(400).json({ error: 'Vehicle tracking already started for this booking' });
        }
        const vehicletracking = new VehicleTracking();
        vehicletracking.vehicle = value.vehicle;
        vehicletracking.booking = value.booking;
        vehicletracking.latitude = value.latitude;
        vehicletracking.longitude = value.longitude;
        vehicletracking.speed = value.speed;
        vehicletracking.maxSpeed = value.maxSpeed || value.speed;
        vehicletracking.avgSpeed = value.avgSpeed || value.speed;
        vehicletracking.distanceTravelled = value.distanceTravelled;
        vehicletracking.status = value.status;
        vehicletracking.isLive = true;
        vehicletracking.lastUpdatedAt = Date.now();
        await vehicletracking.save();
        res.status(201).json(vehicletracking);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}

// vehiclesTrackingCtlr.live = async (req, res) => {
//     try {

//     } catch(err) {
//         console.log(err);
//         res.status(500).json({ error: 'Something went wrong!!!' });
//     }
// }

vehiclesTrackingCtlr.live = async (req, res) => {
    const vehicleId = req.params.id;
    try {
        const latestTracking = await VehicleTracking.findOne({ vehicleId, isLive: true }).sort({ createdAt: -1 });
        if (!latestTracking) {
            return res.status(404).json({ error: 'No active tracking found for this vehicle' });
        }
        res.status(200).json(latestTracking);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}

// vehiclesTrackingCtlr.history = async (req, res) => {
//     try {

//     } catch(err) {
//         console.log(err);
//         res.status(500).json({ error: 'Something went wrong!!!' });
//     }
// }

vehiclesTrackingCtlr.history = async (req, res) => {
    const vehicleId = req.params.id;
    const { startDate, endDate } = req.query;
    try {
        if (!startDate || !endDate) {
            return res.status(400).json({ error: 'Start date and end date are required' });
        }
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (isNaN(start) || isNaN(end)) {
            return res.status(400).json({ error: 'Invalid date format' });
        }
        const history = await VehicleTracking.find({ vehicleId, createdAt: { $gte: start, $lte: end }}).sort({ createdAt: 1 });
        if (history.length === 0) {
            return res.status(404).json({ message: 'No tracking data found in this period' });
        }
        res.status(200).json(history);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}

// vehiclesTrackingCtlr.alerts = async (req, res) => {
//     try {

//     } catch(err) {
//         console.log(err);
//         res.status(500).json({ error: 'Something went wrong!!!' });
//     }
// }

vehiclesTrackingCtlr.alerts = async (req, res) => {
    const vehicleId = req.params.id;
    try {
        const trackings = await VehicleTracking.find({ vehicleId });
        if (trackings.length === 0) {
            return res.status(404).json({ message: 'No tracking data found' });
        }
        const alerts = trackings.filter(track => 
            track.speed > track.maxSpeed || !track.isLive
        ).map(track => ({
            id: track._id,
            timestamp: track.createdAt,
            speed: track.speed,
            maxSpeed: track.maxSpeed,
            status: track.status,
            isLive: track.isLive,
            message: track.speed > track.maxSpeed
                ? `Speed exceeded (${track.speed} > ${track.maxSpeed})`
                : `Vehicle went offline`
        }));
        if (alerts.length === 0) {
            return res.status(200).json({ message: 'No alerts', alerts: [] });
        }
        res.status(200).json({ alerts });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}

// vehiclesTrackingCtlr.hourlyCost = async (req, res) => {
//     try {

//     } catch(err) {
//         console.log(err);
//         res.status(500).json({ error: 'Something went wrong!!!' });
//     }
// }

vehiclesTrackingCtlr.hourlyCost = async (req, res) => {
    const bookingId = req.params.id;
    try {
        const booking = await Booking.findById(bookingId).populate('vehicle');
        if (!booking) {
            return res.status(404).json({ error: "Booking not found" });
        }
        const vehicle = booking.vehicle;
        if (!vehicle) {
            return res.status(404).json({ error: "Vehicle not found" });
        }
        const trackings = await VehicleTracking.find({
            vehicleId: vehicle._id,
            createdAt: { $gte: booking.pickupDate, $lte: booking.returnDate }
        });
        if (trackings.length === 0) {
            return res.status(404).json({ message: "No tracking data found for this booking" });
        }
        const first = trackings[0].createdAt;
        const last = trackings[trackings.length - 1].createdAt;
        const durationMs = last - first; 
        const durationHours = durationMs / (1000 * 60 * 60); 
        const hourlyRate = vehicle.hourlyRate || 0; 
        const totalCost = durationHours * hourlyRate;
        res.status(200).json({
            vehicle: vehicle.name,
            bookingId,
            durationHours: durationHours.toFixed(2),
            hourlyRate,
            totalCost: totalCost.toFixed(2)
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}
module.exports = vehiclesTrackingCtlr;