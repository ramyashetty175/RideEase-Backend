const razorpay = require("../config/razorpay");
const Payment = require('../models/payment-model');
const { validateWebhookSignature } = require("razorpay/dist/utils/razorpay-utils");
const Booking = require('../models/booking-model');

const paymentCtlr = {};


paymentCtlr.createOrder = async (req, res) => {
  try {
    const { amount, currency, receipt, notes } = req.body;

    const options = {
      amount: amount * 100,
      currency,
      receipt,
      notes,
    };

    const order = await razorpay.orders.create(options);

    await Payment.create({
      orderId: order.id,
      amount: amount,
      status: "created",
      booking: receipt,
      user: req.userId
    });

    res.json(order);
  } catch (err) {
    console.log(err);
    res.status(500).json("Error creating order");
  }
};


paymentCtlr.verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const secret = process.env.RAZOPAY_KEY_SECRET; 
  const body = razorpay_order_id + "|" + razorpay_payment_id;

  try {
    const isValidSignature = validateWebhookSignature(body, razorpay_signature, secret);

    if (!isValidSignature) {
      return res.status(400).json({ status: "verification_failed" });
    }

    await Payment.findOneAndUpdate(
      { orderId: razorpay_order_id },
      { status: "paid", paymentId: razorpay_payment_id }
    );
    const booking = await Booking.findById(paymentStatus.booking);
    if (!booking) {
        res.status(404).json({ error: 'Booking not found!!'});
    }
    booking.paymentStatus = "paid";
    booking.bookingStatus = "confirmed";  
    booking.save();
    res.status(200).json({ status: "ok" });
    console.log("Payment verification successful");
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "error" });
  }
};

module.exports = paymentCtlr;