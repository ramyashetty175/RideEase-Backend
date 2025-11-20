const Vehicle = require('../models/vehicle-model');
const { VehicleValidation, ApproveVehicleValidation } = require('../validations/vehicle-validations');

const vehiclesCtlr = {};

vehiclesCtlr.create = async (req, res) => {
    const body = req.body;
    const { error, value } = VehicleValidation.validate(body, { abortEarly: false });
    if(error) {
        return res.status(400).json({ error: error.details });
    }
    try {
        const vehicleInDB = await Vehicle.findOne({ registrationNumber: value.registrationNumber });
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
        vehicle.licenseDoc = value.licenseDoc;
        vehicle.fuelType = value.fuelType;
        vehicle.transmission = value.transmission;
        vehicle.seats = value.seats;
        vehicle.pricePerDay = value.pricePerDay;
        vehicle.location = value.location;
        vehicle.images = value.images;
        vehicle.averageRating = 0;
        await vehicle.save();
        res.status(201).json({ msg: "Vehicle added successfully", vehicle });
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!' });
    }
}

vehiclesCtlr.show = async (req, res) => {
    const id = req.params.id;
    try {
        const vehicle = await Vehicle.findOne({ _id: id, isApproved: true });
        if(!vehicle) {
            return res.status(404).json({ error: 'vehicle not found or pending approval' });
        }
        res.json(vehicle);
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}

vehiclesCtlr.listVehicles = async (req, res) => {
    try {
        let vehicle;
        if(req.role == "admin") {
            vehicle = await Vehicle.find();
        } else {
            vehicle = await Vehicle.find({ isApproved: true });
        }
        if(!vehicle) {
            return res.status(404).json({ error: 'No vehicle found' });
        }
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
        let vehicle;
        if(req.role == "admin") {
            vehicle = await Vehicle.findByIdAndUpdate(id, value, { new: true });
        } else {
            vehicle = await Vehicle.findOneAndUpdate({ _id: id, owner: req.userId }, value, { new: true });
            if(!vehicle) {
            return res.status(403).json({ error: 'You are not allowed to update vehicle or vehicle not exists' });
        }
        }
        if(!vehicle) {
            return res.status(404).json({ error: 'vehicle not exists' });
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
        let vehicle;
        if(req.role == "admin") {
            vehicle = await Vehicle.findByIdAndDelete(id);
        } else {
            vehicle = await Vehicle.findOneAndDelete({ _id: id, owner: req.userId });
            if(!vehicle) {
                return res.status(403).json({ error: 'You are not allowed to remove this vehicle or vehicle does not exists' });
            }
        } 
        if(!vehicle) {
            return res.status(404).json({ error: 'Vehicle does not exists' });
        }       
        res.json({ message: "Vehicle deleted successfully", vehicle });
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}

vehiclesCtlr.approveVehicle = async (req, res) => { 
    const body = req.body;
    const id = req.params.id;
    const { error, value } = ApproveVehicleValidation.validate(body);
    if(error) {
        return res.status(400).json({ error: error.details });
    }
    try {
        if(req.role == 'admin') {
            const vehicle = await Vehicle.findById(id);
            if(!vehicle) {
               return res.status(404).json({ error: 'vehicle not found' });
            }
            vehicle.licenseDoc = value.licenseDoc;
            vehicle.isApproved = true;
            vehicle.availabilityStatus = "Available";
            await vehicle.save();
            return res.json({ message: "Vehicle approved by Admin", vehicle });
        } else {
            return res.json({ message: 'Approval is not needed for this vehicle' });
        } 
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}

vehiclesCtlr.search = async (req, res) => {
    try {
        const { keyword } = req.body;
        if(!keyword || keyword.trim() == "") {
          return res.status(400).json({ error: "keyword is required" });
        }

        // case-insensitive regex pattern
        const regex = new RegExp(keyword.trim(), "i");

        // serach vehicle by registrationNumber or Name
        const vehicleFilter = {
            isApproved: true,
            $or: [{ vehicleName: { $regex: regex } }, { registrationNumber: { $regex: regex } }]
        }
        const vehicle = await Vehicle.find(vehicleFilter);
        if(vehicle.length == 0) {
            return res.status(400).json({ message: "No match vehicle found" });
        }
        res.json(vehicle);
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}
module.exports = vehiclesCtlr;