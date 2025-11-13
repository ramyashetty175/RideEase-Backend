const Payment = require('../models/payment-model');
const Booking = require('../models/booking-model');
const PaymentValidation = require('../validations/payment-validations');

const paymentCtlr = {};

// Route to handle order creation
paymentCtlr.createOrder = async (req, res) => {
  try {
    const { amount, currency, receipt, notes } = req.body;

    const options = {
      amount: amount * 100, // Convert amount to paise
      currency,
      receipt,
      notes,
    };

    const order = await razorpay.orders.create(options);
    
    // Read current orders, add new order, and write back to the file
    const orders = readData();
    orders.push({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      status: 'created',
    });
    writeData(orders);

    res.json(order); // Send order details to frontend, including order ID
  } catch (err) {
    console.log(err);
    res.status(500).json('Error creating order');
  }
}

// Route to serve the success page
// app.get('/payment-success', (req, res) => {
//   res.sendFile(path.join(__dirname, 'success.html'));
// });

// Route to handle payment verification
app.post('/verify-payment', (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const secret = razorpay.key_secret;
    const body = razorpay_order_id + '|' + razorpay_payment_id;

try {
    const isValidSignature = validateWebhookSignature(body, razorpay_signature, secret);
    if (isValidSignature) {
       // Update the order with payment details
       const orders = readData();
       const order = orders.find(o => o.order_id === razorpay_order_id);
       if (order) {
        order.status = 'paid';
        order.payment_id = razorpay_payment_id;
        writeData(orders);
      }
      res.status(200).json({ status: 'ok' });
      console.log("Payment verification successful");
    } else {
      res.status(400).json({ status: 'verification_failed' });
      console.log("Payment verification failed");
    }
} catch (err) {
    console.log(err);
    res.status(500).json({ status: 'error', message: 'Error verifying payment' });
  }
});

paymentCtlr.show = async(req, res) => {
    const id = req.params.id;
    try {
        const payment = await Payment.findOne({ _id: id, user: req.userId });
        if(!payment) {
            return res.status(404).json({ error: 'record not found' });
        }
        res.json(payment);
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }

}

paymentCtlr.list = async(req, res) => {
    try {
        const payment = await Payment.find({ user: req.userId });
        if(!payment) {
           res.status(404).json({ error: 'record not found' });
        }
        res.json(payment);
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}

paymentCtlr.cancel = async (req, res) => {
    try {
        return res.redirect('http://localhost:3020/failure');
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}

module.exports = paymentCtlr;