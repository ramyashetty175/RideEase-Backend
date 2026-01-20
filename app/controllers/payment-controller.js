const razorpay = require('../../config/razopay');
const Payment = require('../models/payment-model');
const crypto = require("crypto");

const paymentCtlr = {};

paymentCtlr.createOrder = async (req, res) => {
    const { amount, currency } = req.body; 
    try {
        const order = await razorpay.orders.create({ amount: amount, currency: currency || "INR" });
        res.status(200).json({
          orderId: order.id,          
          amount: order.amount,
          currency: order.currency,
          key: process.env.RAZOPAY_KEY_ID, 
        });
    } catch (err) {
        res.status(500).json(err);
    }
}

paymentCtlr.verifyPayment = async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const generated_signature = crypto
    .createHmac("sha256", process.env.RAZOPAY_KEY_SECRET)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest("hex");
    if (generated_signature === razorpay_signature) {
        res.status(200).json({ success: true, message: "Payment verified!" });
    } else {
        res.status(400).json({ success: false, message: "Payment verification failed!" });
    }
}

module.exports = paymentCtlr;