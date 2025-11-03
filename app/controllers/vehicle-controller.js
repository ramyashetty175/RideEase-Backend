const Vehicle = require('../models/vehicle-model');
const VehicleValidation = require('../validations/vehicle-validations');

const vehiclesCtlr = {};

vehiclesCtlr.create = async (req, res) => {
    const body = req.body;
    const { error, value } = VehicleValidation.validate(body, { abortEarly: false });
    if(error) {
        return res.status(400).json({ error: error.details });
    }
    try {
        const vehicleInDB = await Vehicle.findOne({ registrationNumber: value.registrationNumber, owner: req.userId });
        if(vehicleInDB) {
            return res.status(400).json({ error: 'vehicle already exists' });
        }
        const vehicle = new Vehicle();
        if(req.role == "admin") {
           vehicle.owner = req.userId;
           vehicle.isApproved = true;
        } else if(req.role == "owner") {
           vehicle.owner = req.userId;
           vehicle.isApproved = false;
        }
        vehicle.vehicleName = value.vehicleName;
        vehicle.brand = value.brand;
        vehicle.type = value.type;
        vehicle.registrationNumber = value.registrationNumber;
        vehicle.license = value.license;
        vehicle.fuelType = value.fuelType;
        vehicle.transmission = value.transmission;
        vehicle.seats = value.seats;
        vehicle.pricePerDay = value.pricePerDay;
        vehicle.location = value.location;
        vehicle.images = value.images;
        vehicle.availabilityStatus = value.availabilityStatus;
        vehicle.averageRating = value.averageRating;
        await vehicle.save();
        res.status(201).json(vehicle);
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!' });
    }
}

vehiclesCtlr.show = async (req, res) => {
    const id = req.params.id;
    try {
        const vehicle = await Vehicle.findOne({ _id: id, owner: req.userId });
        if(!vehicle) {
            return res.status(404).json({ error: 'record not found' });
        }
        res.json(vehicle);
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}

vehiclesCtlr.list = async (req, res) => {
    try {
        const vehicle = await Vehicle.find({ owner: req.userId });
        res.json(vehicle);
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}

vehiclesCtlr.update = async (req, res) => {
    const body = req.body;
    const id = req.params.id;
     const{ error, value } = VehicleValidation.validate(body);
    if(error) {
        return res.status(400).json({ error: error.details });
    }
    try {
        const vehicle = await Vehicle.findOneAndUpdate({ _id: id, user: req.userId }, value, { new: true });
        if(!vehicle) {
            return res.status(404).json({ error: 'record not found' });
        }
        res.json(vehicle);
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}

vehiclesCtlr.remove = async (req, res) => {
    const id = req.params.id;
    try {
        const vehicle = await Vehicle.findOneAndDelete({ _id: id, owner: req.userId });
        if(!vehicle) {
            return res.status(404).json({ error: 'record not found' });
        }
        res.json(vehicle);
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}

vehiclesCtlr.approveOwner = async (req, res) => {
    const body = req.body;
    const id = req.params.id;
    const { error, value } = VehicleValidation.validate(body, { abortEarly: false });
    if(error) {
        return res.status(400).json({ error: error.details });
    }
    try {
        const vehicle = await Vehicle.findOneAndUpdate({ _id: id, owner: req.userId }, value, { new: true });
        if(!vehicle) {
           return res.status(404).json({ error: 'record not found' });
        }
        vehicle.isApproved = true;
        await vehicle.save();
        res.json(vehicle);
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}

module.exports = vehiclesCtlr;