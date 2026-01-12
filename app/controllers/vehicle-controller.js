const Vehicle = require('../models/vehicle-model');
const cloudinary = require("../../config/cloudinary");
const { VehicleValidation } = require('../validations/vehicle-validations');

const vehiclesCtlr = {};

// vehiclesCtlr.create = async (req, res) => {
//     const body = req.body;
//     const { error, value } = VehicleValidation.validate(body, { abortEarly: false });
//     if(error) {
//         return res.status(400).json({ error: error.details });
//     }
//     try {
//         const vehicleInDB = await Vehicle.findOne({ registrationNumber: value.registrationNumber });
//         if(vehicleInDB) {
//             return res.status(400).json({ error: 'vehicle already exists' });
//         }
//         const vehicle = new Vehicle();
//         if(req.role == "admin") {
//             vehicle.owner = req.userId;
//             vehicle.isApproved = true;
//         } else if(req.role == "owner") {
//             vehicle.owner = req.userId;
//             vehicle.isApproved = false;
//         }
//         vehicle.vehicleName = value.vehicleName;
//         vehicle.brand = value.brand;
//         vehicle.type = value.type;
//         vehicle.registrationNumber = value.registrationNumber;
//         vehicle.licenseDoc = value.licenseDoc;
//         vehicle.insuranceDoc = value.insuranceDoc;
//         vehicle.fuelType = value.fuelType;
//         vehicle.transmission = value.transmission;
//         vehicle.seats = value.seats;
//         vehicle.pricePerDay = value.pricePerDay;
//         vehicle.location = value.location;
//         vehicle.image = value.image;
//         vehicle.averageRating = 0;
//         await vehicle.save();
//         res.status(201).json({ msg: "Vehicle added successfully", vehicle });
//     } catch(err) {
//         console.log(err);
//         res.status(500).json({ error: 'Something went wrong!!' });
//     }
// }

vehiclesCtlr.create = async (req, res) => {
    try {
          if (!req.files?.image || !req.files?.licenseDoc || !req.files?.insuranceDoc) {
              return res.status(400).json({ success: false, error: "All files (image, licenseDoc, insuranceDoc) are required" });
          }
          const imageRes = await cloudinary.uploader.upload( 
              req.files.image.tempFilePath,
              {
                folder: "vehicles/images",
                public_id: `vehicle_image_${Date.now()}`,
                resource_type: "image"
              }
          )
          const licenseRes = await cloudinary.uploader.upload(
              req.files.licenseDoc.tempFilePath,
              {
                folder: "vehicles/licenses",
                public_id: `vehicle_license_${Date.now()}`,
                resource_type: "image"
              }
          )
          const insuranceRes = await cloudinary.uploader.upload(
              req.files.insuranceDoc.tempFilePath,
              {
                folder: "vehicles/insurance",
                public_id: `vehicle_insurance_${Date.now()}`,
                resource_type: "image"
              }
          )
          const body = {
              ...req.body,
              image: imageRes.secure_url,
              licenseDoc: licenseRes.secure_url,
              insuranceDoc: insuranceRes.secure_url
          }
          const { error, value } = VehicleValidation.validate(body, { abortEarly: false });
          if (error) {
              return res.status(400).json({ success: false, errors: error.details });
          }
          const vehicleInDB = await Vehicle.findOne({ registrationNumber: value.registrationNumber });
          if (vehicleInDB) {
              return res.status(400).json({ success: false, error: "Vehicle already exists" });
          }
          const vehicle = new Vehicle();
          vehicle.vehicleName = value.vehicleName;
          vehicle.owner = req.userId;
          vehicle.brand = value.brand;
          vehicle.type = value.type;
          vehicle.registrationNumber = value.registrationNumber;
          vehicle.licenseDoc = value.licenseDoc;
          vehicle.insuranceDoc = value.insuranceDoc;
          vehicle.fuelType = value.fuelType;
          vehicle.transmission = value.transmission;
          vehicle.seats = value.seats;
          vehicle.pricePerDay = value.pricePerDay;
          vehicle.location = value.location;
          vehicle.image = value.image;
          vehicle.availabilityStatus = value.availabilityStatus;
          if (req.role === 'admin') {
              vehicle.isApproved = true;
          } else {
              vehicle.isApproved = false;
          }
          await vehicle.save();
          res.status(201).json({ success: true, message: "Vehicle added successfully", vehicle });
          } catch (err) {
              console.error(err);
              res.status(500).json({ success: false, error: "Something went wrong!!!" });
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
        let vehicles;
        if(req.role == 'admin'|| req.role == 'user') {
            vehicles = await Vehicle.find();
        } else if(req.role == 'owner') {
            vehicles = await Vehicle.find({ owner: req.userId });
        }
        if(!vehicles) {
            return res.status(404).json({ error: 'No vehicle found' });
        }
        res.json(vehicles);
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}

// vehiclesCtlr.update = async (req, res) => { 
//     const body = req.body;
//     const id = req.params.id;
//      const{ error, value } = VehicleValidation.validate(body);
//     if(error) {
//         return res.status(400).json({ error: error.details });
//     }
//     try {
//         let vehicle;
//         if(req.role == "admin") {
//             vehicle = await Vehicle.findByIdAndUpdate(id, value, { new: true });
//         } else {
//             vehicle = await Vehicle.findOneAndUpdate({ _id: id, owner: req.userId }, value, { new: true });
//             if(!vehicle) {
//                 return res.status(403).json({ error: 'You are not allowed to update vehicle or vehicle not exists' });
//             }
//         }
//         if(!vehicle) {
//             return res.status(404).json({ error: 'vehicle not exists' });
//         }
//         res.json(vehicle);
//     } catch(err) {
//         console.log(err);
//         res.status(500).json({ error: 'Something went wrong!!!' });
//     }
// }



vehiclesCtlr.update = async (req, res) => { 
    const id = req.params.id;
    try {
        let vehicle;
        if (req.role === "admin") {
            vehicle = await Vehicle.findById(id);
        } else {
            vehicle = await Vehicle.findOne({ _id: id, owner: req.userId });
            if (!vehicle) {
                return res.status(403).json({ error: 'You are not allowed to update this vehicle or it does not exist' });
            }
        }
        if (!vehicle) {
            return res.status(404).json({ error: 'Vehicle not found' });
        }
        const { error, value } = VehicleValidation.validate(req.body, { abortEarly: false });
        if (error) {
            return res.status(400).json({ success: false, errors: error.details });
        }
        Object.assign(vehicle, value);
        if (req.files) {
            if (req.files.image) {
                const imageRes = await cloudinary.uploader.upload(req.files.image.tempFilePath, {
                    folder: "vehicles/images",
                    public_id: `vehicle_image_${Date.now()}`,
                    resource_type: "image",
                });
                vehicle.image = imageRes.secure_url;
            }
            if (req.files.licenseDoc) {
                const licenseRes = await cloudinary.uploader.upload(req.files.licenseDoc.tempFilePath, {
                    folder: "vehicles/licenses",
                    public_id: `vehicle_license_${Date.now()}`,
                    resource_type: "image",
                });
                vehicle.licenseDoc = licenseRes.secure_url;
            }
            if (req.files.insuranceDoc) {
                const insuranceRes = await cloudinary.uploader.upload(req.files.insuranceDoc.tempFilePath, {
                    folder: "vehicles/insurance",
                    public_id: `vehicle_insurance_${Date.now()}`,
                    resource_type: "image",
                });
                vehicle.insuranceDoc = insuranceRes.secure_url;
            }
        }
        await vehicle.save();
        res.json({ success: true, message: "Vehicle updated successfully", vehicle });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Something went wrong!!!' });
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
    const id = req.params.id;
    try {
        if(req.role !== 'admin') {
            return res.status(403).json({ message: 'Only admin can approve vehicle' });
        }
        const vehicle = await Vehicle.findById(id);
        if (!vehicle) {
            return res.status(404).json({ error: 'Vehicle not found' });
        }
        if (!vehicle.licenseDoc || !vehicle.insuranceDoc) {
            return res.status(400).json({ error: "Both license and insurance documents must be uploaded before approval" });
        }
        vehicle.status = "approved";
        vehicle.availabilityStatus = "Available";
        await vehicle.save();
        return res.json({ message: "Vehicle approved successfully", vehicle });
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}

vehiclesCtlr.rejectVehicle = async (req, res) => { 
    const id = req.params.id;
    try {
        if(req.role !== 'admin') {
            return res.status(403).json({ message: 'Only admin can reject vehicle' });
        }
        const vehicle = await Vehicle.findById(id);
        if (!vehicle) {
            return res.status(404).json({ error: 'Vehicle not found' });
        }
        vehicle.status = "rejected";
        vehicle.availabilityStatus = "unAvailable";
        await vehicle.save();
        return res.json({ message: "Vehicle rejected successfully", vehicle }); 
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
        // search vehicle by registrationNumber or Name
        const vehicleFilter = {
            status: "approved",
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