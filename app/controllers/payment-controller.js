const razorpay = require('../../config/razopay');
const Payment = require('../models/payment-model');
const Booking = require('../models/booking-model');
const crypto = require("crypto");

const paymentCtlr = {};

// paymentCtlr.createOrder = async (req, res) => {
//     const { amount, currency } = req.body; 
//     try {
//         const order = await razorpay.orders.create({ amount: amount, currency: currency || "INR" });
//         res.status(200).json({
//           orderId: order.id,          
//           amount: order.amount,
//           currency: order.currency,
//           key: process.env.RAZOPAY_KEY_ID, 
//         });
//     } catch (err) {
//         res.status(500).json(err);
//     }
// }

// paymentCtlr.verifyPayment = async (req, res) => {
//     const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
//     const generated_signature = crypto
//     .createHmac("sha256", process.env.RAZOPAY_KEY_SECRET)
//     .update(razorpay_order_id + "|" + razorpay_payment_id)
//     .digest("hex");
//     if (generated_signature === razorpay_signature) {
//         res.status(200).json({ success: true, message: "Payment verified!" });
//     } else {
//         res.status(400).json({ success: false, message: "Payment verification failed!" });
//     }
// }

paymentCtlr.createOrder = async (req, res) => {
    const { amount, currency, bookingId } = req.body; 
    try {
        const order = await razorpay.orders.create({ amount: amount, currency: currency || "INR" });
        const payment = new Payment();
        payment.orderId = order.id;
        payment.amount = order.amount;
        payment.status = "created";
        payment.user = req.userId;
        payment.booking = bookingId;
        await payment.save();
        res.status(201).json({ orderId: order.id, amount: order.amount, currency: order.currency, key: process.env.RAZOPAY_KEY_ID });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}

paymentCtlr.verifyPayment = async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    try {
        const generated_signature = crypto
            .createHmac("sha256", process.env.RAZOPAY_KEY_SECRET)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest("hex");

        const payment = await Payment.findOne({ orderId: razorpay_order_id }).populate("booking");

        if (!payment) {
            return res.status(404).json({ error: "Payment not found!" });
        }
        const booking = await Booking.findById(payment.booking);
            if (!booking) {
                return res.status(404).json({ error: 'Booking not found' });
            }
        if (generated_signature === razorpay_signature) {
            payment.status = "paid";
            await payment.save();
            booking.paymentStatus = "paid";
            await booking.save();
            res.status(200).json({ success: true, message: "Payment verified!" });
        }
            payment.status = "failed";
            await payment.save();
            booking.paymentStatus = "failed";
            await booking.save();
            res.status(200).json({ success: false, message: "Payment verification failed!" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Something went wrong while verifying payment" });
    }
}

module.exports = paymentCtlr;