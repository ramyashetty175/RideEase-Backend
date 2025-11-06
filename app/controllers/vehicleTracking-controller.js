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
        const existvehicleTracking = await VehicleTracking({ user: req.userId });
        const vehicletracking = new VehicleTracking();
        vehicletracking.vehicleId = value.vehicleId;
        vehicletracking.latitude = value.latitude;
        vehicletracking.longitude = value.longitude;
        vehicletracking.speed = value.speed;
        vehicletracking.status = value.status;
        await vehicletracking.save();
        res.status(201).json(vehicletracking);
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}

vehiclesTrackingCtlr.live = async (req, res) => {
    try {
        
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}

vehiclesTrackingCtlr.history = async (req, res) => {
    try {

    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}

vehiclesTrackingCtlr.alerts = async (req, res) => {
    try {

    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}

vehiclesTrackingCtlr.hourlyCost = async (req, res) => {
    try {

    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}

module.exports = vehiclesTrackingCtlr;
