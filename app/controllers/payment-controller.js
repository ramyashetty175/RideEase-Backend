const Payment = require('../models/payment-model');
const Booking = require('../models/booking-model');
const PaymentValidation = require('../validations/payment-validations');

const paymentCtlr = {};

paymentCtlr.create = async(req, res) => {
    const body = req.body;
    const { error, value } = PaymentValidation.validate(body, { abortEarly: false });
    if(error) {
        return res.status(400).json({ error: error.details });
    }
    try {
        const booking = await Booking.findOne({ _id: value.booking, user: req.userId });
        if(!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }
        if(booking.paymentStatus === 'Paid') {
            return res.status(400).json({ error: 'Payment already completed for this booking' });
        }
        const payment = new Payment();
        payment.booking = value.booking;
        payment.user = req.userId;
        payment.amount = value.amount;
        payment.transactionId = value.transactionId;
        payment.paymentStatus = value.paymentStatus;
        payment.refundAmount = value.refundAmount;
        payment.refundStatus = value.refundStatus;
        await payment.save();
        res.status(201).json(payment);
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}

paymentCtlr.show = async(req, res) => {
    try {
        const payment = await Payment.find({ user: req.userId });
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
    const id = req.params.id;
}

paymentCtlr.update = async(req, res) => {
    const body = req.body;
    const id = req.params.id;
    const { error, value } = PaymentValidation.validate(body);
    if(error) {
        return res.status(400).json({ error: error.details });
    }
    try {
        const payment = await Payment.findOneAndUpdate({ _id: id, user: req.userId }, value, { new: true });
        if(!payment) {
            return res.status().json({ error: 'record not found' });
        }
        res.json(payment);
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}
 
paymentCtlr.remove = async(req, res) => {
    const id = req.params.id;
    try {
        const payment = await Payment.findOneAndDelete({ _id: id, user: req.userId });
        if(!payment) {
           return res.status(404).json({ error: 'record not found' });
        }
        res.json(payment);
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}

module.exports = paymentCtlr;