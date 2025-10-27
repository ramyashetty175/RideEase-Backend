const vehicleTracking = require('../models/vehicleTracking-model');
const VehicleTracking = require('../models/vehicleTracking-model');
const VehicleTrackingValidation = require('../validations/vehicleTracking-validations');

const vehiclesTrackingCtlr = {};

vehiclesTrackingCtlr.create = async (req, res) => {
    const body = req.body;
    const { error, value } = VehicleTrackingValidation.validate(body, { abortEarly: false });
    if(error) {
        return res.status(400).json({ error: error.details });
    }
    try {
    
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}

vehiclesTrackingCtlr.list = async (req, res) => {
    try {
        const vehicletracking = await VehicleTracking.find({ user: req.userId });
        if(!vehiclesTrackingCtlr) {
           return res.status(404).json({ error: 'record not found' });
        }
        res.json(vehicletracking);
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}

vehiclesTrackingCtlr.show = async (req, res) => {
    const id = req.params.id;
    try {
        const vehicletracking = await VehicleTracking.findOne({ _id: id, user: req.userId });
        if(!vehicletracking) {
            return res.status(404).json({ error: 'record not found' });
        }
        res.json(vehicletracking);
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}

vehiclesTrackingCtlr.update = async (req, res) => {
    const body = req.body;
    const id = req.params.id;
    const { error, value } = VehicleTrackingValidation.validate(body);
    if(error) {
        return res.status(400).json({ error: error.details });
    }
    try {
        const vehicleTracking = await VehicleTracking.findOne({ user: req.userId });
        const vehicletracking = new VehicleTracking();
        await vehicletracking.save();
        res.status(201).json(vehicletracking);
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}

vehiclesTrackingCtlr.remove = async (req, res) => {
    const id = req.params.id;
    try {

    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}

module.exports = vehiclesTrackingCtlr;