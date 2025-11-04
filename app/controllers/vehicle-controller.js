const Vehicle = require('../models/vehicle-model');
const Notification = require('../models/notification-model');
const User = require('../models/user-Authmodel');
const { VehicleValidation, ApproveVehicleValidation } = require('../validations/vehicle-validations');

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
            const admin = await User.findOne({ role: "admin" });
            if(admin) {
               const notification = new Notification();
               notification.userId = admin._id;
               notification.senderId = req.userId;
               notification.vehicleId = vehicle._id
               notification.relatedId = vehicle._id;
               notification.relatedModel = "Vehicle";
               notification.type = "system";
               notification.title = "New Vehicle Pending Approval";
               notification.message = `Owner ${req.user.username} added a new vehicle (${vehicle.vehicleName}) awaiting approval.`;
               notification.priority = "high"
               await notification.save();
            }
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
     const{ error, value } = ApproveVehicleValidation.validate(body);
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
        const admin = await User.findOne({ role: 'admin' });
        if(admin) {
            const notification = new Notification();
            notification.userId = owner._id;
            notification.senderId = req.userId;
            notification.vehicleId = vehicle._id
            notification.relatedId = vehicle._id;
            notification.relatedModel = "Vehicle";
            notification.type = "system";
            notification.title = "Vehicle Approved";
            notification.message = `admin removed ${vehicle.vehicleName} vehicle`;
            notification.priority = "high"
            await notification.save();
        }
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}

vehiclesCtlr.approveOwner = async (req, res) => {
    const body = req.body;
    const id = req.params.id;
    const { error, value } = ApproveVehicleValidation.validate(body, { abortEarly: false });
    if(error) {
        return res.status(400).json({ error: error.details });
    }
    try {
        const vehicle = await Vehicle.findOneAndUpdate({ _id: id }, value, { new: true });
        if(!vehicle) {
           return res.status(404).json({ error: 'record not found' });
        }
        if(vehicle.licenseDoc) {
           vehicle.isApproved = true;
           vehicle.availabilityStatus = "Available";
        }
        await vehicle.save();
        res.json(vehicle);
        const owner = await User.findOne({ role: owner });
        if(owner) {
            const notification = new Notification();
            notification.userId = owner._id;
            notification.senderId = req.userId;
            notification.vehicleId = vehicle._id
            notification.relatedId = vehicle._id;
            notification.relatedModel = "Vehicle";
            notification.type = "system";
            notification.title = "Vehicle Approved";
            notification.message = `Your vehicle "${vehicle.vehicleName}" has been approved and is now active.`;
            notification.priority = "high"
            await notification.save();
        }
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}

module.exports = vehiclesCtlr;