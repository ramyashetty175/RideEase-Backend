const razorpay = require('../../config/razopay');
const Payment = require('../models/payment-model');
const crypto = require("crypto");
// const { validateWebhookSignature } = require("razorpay/dist/utils/razorpay-utils");
// const Booking = require('../models/booking-model');

// const paymentCtlr = {};

// paymentCtlr.createOrder = async (req, res) => {
//   try {
//     const { amount, currency } = req.body;
//     const options = {
//       amount: amount * 100,
//       currency: currency || 'INR'
//     };
//     const order = await razorpay.orders.create(options);
//     await Payment.create({
//       orderId: order.id,
//       amount: amount,
//       status: "created",
//       booking: receipt,
//       user: req.userId
//     });
//     res.status(201).json(order);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json("Error creating order");
//   }
// }

// paymentCtlr.verifyPayment = async (req, res) => {
//   const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

//   const secret = process.env.razorpay.RAZOPAY_KEY_SECRET; 
//   const body = razorpay_order_id + "|" + razorpay_payment_id;

//   try {
//     const isValidSignature = validateWebhookSignature(body, razorpay_signature, secret);

//     if (!isValidSignature) {
//       return res.status(400).json({ status: "verification_failed" });
//     }

//     const payment = await Payment.findOneAndUpdate(
//       { orderId: razorpay_order_id },
//       { status: "paid", paymentId: razorpay_payment_id }
//     );
//     const booking = await Booking.findById(payment.booking);
//     if (!booking) {
//         res.status(404).json({ error: 'Booking not found!!'});
//     }
//     booking.paymentStatus = "paid";
//     booking.bookingStatus = "confirmed";  
//     booking.save();
//     res.status(200).json({ status: "ok" });
//     console.log("Payment verification successful");
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ status: "error" });
//   }
// };

const paymentCtlr = {};

paymentCtlr.createOrder = async (req, res) => {
  const { amount, currency } = req.body; // Amount in paise (e.g., 50000 = ₹500)
  try {
    const order = await razorpay.orders.create({
      amount: amount, // Amount in paise
      currency: currency || "INR",
    });
    // res.status(200).json(order); // Send order details to frontend
    res.status(200).json({
  orderId: order.id,          // send as orderId
  amount: order.amount,
  currency: order.currency,
  key: process.env.RAZOPAY_KEY_ID, // send public key to frontend
});

  } catch (error) {
    res.status(500).send(error);
  }
}

paymentCtlr.verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const generated_signature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest("hex");

  if (generated_signature === razorpay_signature) {
    res.status(200).json({ success: true, message: "Payment verified!" });
  } else {
    res.status(400).json({ success: false, message: "Payment verification failed!" });
  }
}

module.exports = paymentCtlr;