// const VehicleTracking = require('../models/vehicleTracking-model');
// const VehicleTrackingValidation = require('../validations/vehicleTracking-validations');
// const Booking = require('../models/booking-model');

// const vehiclesTrackingCtlr = {};

// vehiclesTrackingCtlr.updateVehicleLocation = async (data) => {
//     const { vehicleId, bookingId, lat, lng } = data;
//     try {
//         await VehicleLocation.findOneAndUpdate(
//             { vehicleId },
//             { 
//                 vehicleId, 
//                 bookingId, 
//                 location: { type: 'Point', coordinates: [lng, lat] },
//                 updatedAt: new Date()
//             },
//             { upsert: true, new: true }
//         );
//     } catch (err) {
//         console.error('Database update error:', err);
//     }
// }

// module.exports = vehiclesTrackingCtlr;



const VehicleTracking = require('../models/vehicleTracking-model');

const vehiclesTrackingCtlr = {};

vehiclesTrackingCtlr.updateVehicleLocation = async (data) => {
    const { vehicleId, bookingId, lat, lng, speed } = data;
    try {
        await VehicleTracking.findOneAndUpdate(
            { vehicle: vehicleId, booking: bookingId, isLive: true },
            { 
                vehicle: vehicleId, 
                booking: bookingId, 
                location: { type: 'Point', coordinates: [lng, lat] },
                speed: speed || 0,
                lastUpdatedAt: new Date()
            },
            { upsert: true, new: true }
        );
    } catch (err) {
        console.error('Database update error:', err);
    }
};

module.exports = vehiclesTrackingCtlr;