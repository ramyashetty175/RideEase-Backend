const vehicleTracking = require('../models/vehicleTracking-model');
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
        
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}

vehiclesTrackingCtlr.show = async (req, res) => {

}

vehiclesTrackingCtlr.update = async (req, res) => {

}

vehiclesTrackingCtlr.remove = async (req, res) => {

}

module.exports = vehiclesTrackingCtlr;