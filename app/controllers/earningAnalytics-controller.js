const EarningAnalytics = require('../models/earningAnalytics-model');
const EarningAnalyticsValidations = require('../validations/earningAnalytics-validations');

const earningAnalyticsCtlr = {};

earningAnalyticsCtlr.create = async(req, res) => {
    const body = req.body;
    const { error, value } = EarningAnalyticsValidations.validate(body, { abortEarly: false });
    if(error) {
        return res.status(400).json({ error: error.details });
    }
    try {
        const earningAnalytics = new EarningAnalytics();
        EarningAnalytics.owner = value.owner;
        EarningAnalytics.totalEarnings = value.totalEarnings;
        EarningAnalytics.totalBookings = value.totalBookings;
        EarningAnalytics.averageRating = value.averageRating;
        EarningAnalytics.reportPeriod = value.reportPeriod;
        EarningAnalytics.topVehicle = value.topVehicle;
        EarningAnalytics.dateRange = value.dateRange;
        await earningAnalytics.save();
        res.status(201).json(earningAnalytics);
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}

earningAnalyticsCtlr.show = async(req, res) => {
    const id = req.params.id;
    try {
        const earningAnalytics = await EarningAnalytics.findOne({ _id: id, user: req.userId });
        if(!earningAnalytics) {
           return res.status(404).json({ error: 'record not found' });
        }
        res.json(earningAnalytics);
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}

earningAnalyticsCtlr.list = async(req, res) => {
    try {
        const earningAnalytics = await EarningAnalytics.find({ user: req.userId });
        if(!earningAnalytics) {
            return res.status(404).json({ error: 'record not found' });
        }
        res.json(earningAnalytics);
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}

earningAnalyticsCtlr.update = async(req, res) => {
    const body = req.body;
    const id = req.params.id;
    const { error, value } = EarningAnalyticsValidations.validate(body);
    if(error) {
        return res.status(400).json({ error: error.details });
    }
    try {
        const earningAnalytics = await EarningAnalytics.findOneAndUpdate({ _id: id, user: req.userId }, value, { new: true });
        if(!earningAnalytics) {
           return res.status(404).json({ error: 'record not found' });
        }
        res.json(earningAnalytics);
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }

}

earningAnalyticsCtlr.remove = async(req, res) => {
    const id = req.params.id;
    try {
        const earningAnalytics = await EarningAnalytics.findOneAndDelete({ _id: id, user: req.userId });
        if(!earningAnalytics) {
           res.status(404).json({ error: 'record not found' });
        }
        res.json(earningAnalytics);
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}

module.exports = earningAnalyticsCtlr;
