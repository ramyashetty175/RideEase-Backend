const cloudinary = require("../../config/cloudinary");

const imageUpload = {};

imageUpload.avatar = async (req, res) => {
    try {

    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    } 
}