const cloudinary = require("../../config/cloudinary");
const User = require('../models/user-Authmodel');

const imageUpload = {};

// Upload Image
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

// Upload Licence
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

// Upload Insurance
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

module.exports = imageUpload;