const cloudinary = require("../../config/cloudinary");

const imageUpload = {};

imageUpload.avatar = async (req, res) => {
    try {
        if(!req.files || !req.files.avatar) {
           return res.status(400).json({ error: "NO file uploaded" });
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
        return res.status(200).json({ avatarUrl: uploadResult.secure_url });
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    } 
}

module.exports = imageUpload;