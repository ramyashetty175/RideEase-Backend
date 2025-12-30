const cloudinary = require("../../config/cloudinary");
const User = require('../models/user-Authmodel');
const Vehicle = require('../models/user-Authmodel');

const imageUpload = {};

imageUpload.avatar = async (req, res) => {
    try {
        if(!req.files || !req.files.avatar) {
           return res.status(400).json({ error: "image is not uploaded" });
        }
        const file = req.files.avatar;
        const uploadResult = await cloudinary.uploader.upload(
            file.tempFilePath,
            {
                folder: "profile_pics",
                public_id: `avatar_${Date.now()}`,
                resource_type: "image"
            }
        )
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        user.avatar = uploadResult.secure_url;
        await user.save();
        return res.status(200).json({ avatarUrl: uploadResult.secure_url, message: "Avatar uploaded successfully" });
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    } 
}

imageUpload.licence = async (req, res) => {
    try {
        if (!req.files || !req.files.licenceDoc) {
            return res.status(400).json({ error: "licence is not uploaded" });
        }
        const file = req.files.licenceDoc;
        const uploadResult = await cloudinary.uploader.upload(
            file.tempFilePath,
            {
                folder: "licence_docs",
                public_id: `licence_${Date.now()}`,
                resource_type: "image"
            }
        );
        const user = await User.findById(req.userId);
        if (!user) return res.status(404).json({ error: "User not found" });
        user.licenceDoc = uploadResult.secure_url;
        await user.save();
        return res.status(200).json({ licenceDoc: uploadResult.secure_url, message: "Licence uploaded successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}

imageUpload.insurance = async (req, res) => {
    try {
        if (!req.files || !req.files.insuranceDoc) {
            return res.status(400).json({ error: "insurance is not uploaded" });
        }
        const file = req.files.insuranceDoc;
        const uploadResult = await cloudinary.uploader.upload(
            file.tempFilePath,
            {
                folder: "insurance_docs",
                public_id: `insurance_${Date.now()}`,
                resource_type: "image"
            }
        );
        const user = await User.findById(req.userId);
        if (!user) return res.status(404).json({ error: "User not found" });
        user.insuranceDoc = uploadResult.secure_url;
        await user.save();
        return res.status(200).json({ insuranceDoc: uploadResult.secure_url, message: "Insurance uploaded successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}

imageUpload.Vehicleimage = async (req, res) => {
    try {
        const id = req.params.id;
        if(!req.files || !req.files.iamge) {
           return res.status(400).json({ error: "vehicle image is not uploaded" });
        }
        const file = req.files.vehicle;
        const uploadResult = await cloudinary.uploader.upload(
            file.tempFilePath,
            {
                folder: "vehicle_images",
                public_id: `vehicle_${Date.now()}`,
                resource_type: "image"
            }
        )
        const vehicle = await Vehicle.findById(id);
        if (!vehicle) {
            return res.status(404).json({ error: "Vehicle not found" });
        }
        vehicle.image = uploadResult.secure_url;
        await vehicle.save();
        res.status(200).json({ image: uploadResult.secure_url, message: "Vehicle image uploaded successfully" });
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    } 
}

imageUpload.Vehiclelicence = async (req, res) => {
    try {
        const id = req.params.id;
        if (!req.files || !req.files.licenceDoc) {
            return res.status(400).json({ error: "licence is not uploaded" });
        }
        const file = req.files.licenceDoc;
        const uploadResult = await cloudinary.uploader.upload(
            file.tempFilePath,
            {
                folder: "licence_docs",
                public_id: `licence_${Date.now()}`,
                resource_type: "image"
            }
        );
        const vehicle = await Vehicle.findById(id);
        if (!vehicle) return res.status(404).json({ error: "Vehicle not found" });
        vehicle.licenceDoc = uploadResult.secure_url;
        await vehicle.save();
        return res.status(200).json({ licenceDoc: uploadResult.secure_url, message: "Licence uploaded successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}

imageUpload.Vehicleinsurance = async (req, res) => {
    try {
        const id = req.params.id;
        if (!req.files || !req.files.insuranceDoc) {
            return res.status(400).json({ error: "insurance is not uploaded" });
        }
        const file = req.files.insuranceDoc;
        const uploadResult = await cloudinary.uploader.upload(
            file.tempFilePath,
            {
                folder: "insurance_docs",
                public_id: `insurance_${Date.now()}`,
                resource_type: "image"
            }
        );
        const vehicle = await Vehicle.findById(id);
        if (!vehicle) return res.status(404).json({ error: "Vehicle not found" });
        vehicle.insuranceDoc = uploadResult.secure_url;
        await vehicle.save();
        return res.status(200).json({ insuranceDoc: uploadResult.secure_url, message: "Insurance uploaded successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}

module.exports = imageUpload;