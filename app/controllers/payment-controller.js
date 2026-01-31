const razorpay = require('../../config/razopay');
const Payment = require('../models/payment-model');
const Booking = require('../models/booking-model');
const crypto = require("crypto");

const paymentCtlr = {};

// Payment CreateOrder
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

// Verify Payment
paymentCtlr.verifyPayment = async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    try {
        const generated_signature = crypto
            .createHmac("sha256", process.env.RAZOPAY_KEY_SECRET)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest("hex");
        const payment = await Payment.findOne({ orderId: razorpay_order_id });
        if (!payment) {
            return res.status(404).json({ success: false, message: "Payment not found!" });
        }
        if (generated_signature === razorpay_signature) {
            payment.transactionId = razorpay_payment_id;  
            payment.status = "paid";  
            await payment.save();
            if (payment.booking) {
                const booking = await Booking.findById(payment.booking);
                if (booking) {
                    booking.paymentStatus = "paid";
                    await booking.save();
                }
            }
            return res.status(200).json({ success: true, message: "Payment verified!" });
        } else {
            payment.status = "failed";  
            await payment.save();
            if (payment.booking) {
                const booking = await Booking.findById(payment.booking);
                if (booking) {
                    booking.paymentStatus = "failed";
                    await booking.save();
                }
            }
            return res.status(400).json({ success: false, message: "Payment verification failed!" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Something went wrong while verifying payment" });
    }
}

paymentCtlr.cancel = async (req, res) => {
  try {
    const { orderId } = req.body;
    const payment = await Payment.findOne({ orderId });
    if (!payment) return res.status(404).json({ message: "Payment not found!" });

    payment.status = "failed"; // mark as failed
    await payment.save();

    if (payment.booking) {
      const booking = await Booking.findById(payment.booking);
      if (booking) {
        booking.paymentStatus = "failed"; // mark booking as failed
        await booking.save();
      }
    }
    res.status(200).json({ success: true, message: "Payment marked as failed." });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Error marking payment failed." });
  }
}

// Payment List
paymentCtlr.list = async (req, res) => {
    try {
        const payments = await Payment.find({ user: req.userId }).populate("user", "username email");
        res.status(200).json(payments);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Something went wrong while fetching payments" });
    }
}
module.exports = paymentCtlr;