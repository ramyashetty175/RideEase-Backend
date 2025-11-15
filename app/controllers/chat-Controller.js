const Booking = require("../app/models/booking-model");
const Vehicle = require("../app/models/vehicle-model");
const Payment = require("../app/models/payment-model");
const BookingCancellation = require("../app/models/booking-cancellation-model");
const VehicleTracking = require("../app/models/vehicleTracking-model");

const chatCtlr = {};

chatCtlr.askAI = async (req, res) => {
    const userMessage = req.body;
    try {
        // Build a prompt
        const prompt = `
        You are an AI assistant for a Vehicle Rental App.
        VERY IMPORTANT RULES:
        - Only answer using the database data given.
        - If user asks for an ID (bookingId, PaymentId, vehicleId, bookingCancellationId) not present in data -> Tell them "Invalid ID".
        - Do not guess any information that is not provided.
        - If user has no data politely tell them.
        DATABASE:
        BOOKING
        VEHICLE
        PAYMENT
        BOOKINGCANCELLATION
        `;
        // call gpt-5.1
        const response = await client.responses.create({
           model: "gpt-5.1",
           input: prompt
        });
        const aiResponse = response.output_text;
        res.json({ reply: aiResponse });
    } catch(err) {
       console.log(err);
       res.status(500).json({ error: 'AI request failed' });
    }
}

module.exports = chatCtlr;