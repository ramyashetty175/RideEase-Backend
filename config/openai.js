import OpenAI from "openai";
const Booking = require("../app/models/booking-model");
const Vehicle = require("../app/models/vehicle-model");
const Payment = require("../app/models/payment-model");
const BookingCancellation = require("../app/models/booking-cancellation-model");
const VehicleTracking = require("../app/models/vehicleTracking-model");

const client = new OpenAI();

const askAI = {};

askAI = async (req, res) => {
try {
    const response = await client.responses.create({
        model: "gpt-5.1",
        input: prompt
    });
} catch(err) {
    console.log(err);
    response.status(500).json({ error: 'Something went wrong!!!' });
}
}

module.exports = askAI;