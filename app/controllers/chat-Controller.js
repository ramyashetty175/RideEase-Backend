const Booking = require("../app/models/booking-model");
const Vehicle = require("../app/models/vehicle-model");
const Payment = require("../app/models/payment-model");
const BookingCancellation = require("../app/models/booking-cancellation-model");
const VehicleTracking = require("../app/models/vehicleTracking-model");

const chatCtlr = {};

chatCtlr.askAI = async (req, res) => {
    try {
        const prompt = ``;
        const response = await client.responses.create({
           model: "gpt-5.1",
           input: prompt
        });
    } catch(err) {
       console.log(err);
       response.status(500).json({ error: 'AI request failed' });
    }
}

module.exports = chatCtlr;