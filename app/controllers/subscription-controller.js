const Subscription = require('../models/subscription-model');
const SubscriptionValidations = require('../validations/subscription-validations');

const subscriptionCtlr = {};

subscriptionCtlr.create = async(req, res) => {
    const body = req.body;
    const { error, value } = SubscriptionValidations.validate(body, { abortEarly: false });
    if(error) {
        return res.status(400).json({ error: error.details });
    }
    try {
        const subscription = new Subscription();
        subscription.user = req.userId;
        subscription.planType = value.planType;
        subscription.price = value.price;
        subscription.startDate = value.startDate;
        subscription.endDate = value.endDate;
        subscription.isActive = value.isActive;
        subscription.features = value.features;
        subscription.paymentStatus = value.paymentStatus;
        await subscription.save();
        res.status(201).json(subscription);
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}

subscriptionCtlr.show = async(req, res) => {
    const id = req.params.id;
    try {
        const subscription = await Subscription.findOne({ _id: id, user: req.userId });
        if(!subscription) {
           return res.status(404).json({ error: 'record not found' });
        }
        res.json(subscription);
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}

subscriptionCtlr.list = async(req, res) => {
    try {
        const subscription = await Subscription.find({ user: req.userId });
        if(!subscription) {
            return res.status(404).json({ error: 'record not found' });
        }
        res.json(subscription);
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}

subscriptionCtlr.update = async(req, res) => {
    const body = req.body;
    const id = req.params.id;
    const { error, value } = SubscriptionValidations.validate(body);
    if(error) {
        return res.status(400).json({ error: error.details });
    }
    try {
        const subscription = await Subscription.findOneAndUpdate({ _id: id, user: req.userId }, value, { new: true });
        if(!subscription) {
           return res.status(404).json({ error: 'record not found' });
        }
        res.json(subscription);
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}

subscriptionCtlr.remove = async(req, res) => {
    const id = req.params.id;
    try {
        const subscription = await Subscription.findOneAndDelete({ _id: id, user: req.userId });
        if(!subscription) {
           return res.status(404).json({ error: 'record not found' });
        } 
        res.json(subscription);
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}

module.exports = subscriptionCtlr;