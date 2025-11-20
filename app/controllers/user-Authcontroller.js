const User = require('../models/user-Authmodel');
const { error } = require('../validations/review-validations');
const { UserRegisterValidation, UserLoginValidation, ChangePasswordValidation, ApproveOwnerValidation, UpdateProfileValidation } = require('../validations/user-Authvalidations');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const usersCtlr = {};

usersCtlr.register = async(req, res) => {
    const body = req.body;
    const { error, value } = UserRegisterValidation.validate(body, { abortEarly: false });
    if(error) {
        return res.status(400).json({ error: error.details });
    }
    try {
        const userByEmail = await User.findOne({ email: value.email });
        if(userByEmail) {
           return res.status(400).json({ msg: 'email already exists' });
        }
        const user = new User();
        user.username = value.username;
        user.email = value.email;
        const salt = await bcryptjs.genSalt();
        const hash = await bcryptjs.hash(value.password, salt);
        user.password = hash;
        const userCount = await User.countDocuments();
        if(userCount == 0) {
            user.role = "admin";
        } else if(userCount > 0 && userCount <= 3) {
            user.role = "owner";
            user.isApproved = false;
        } else {
            user.role = "user";
        }
        await user.save();
        res.status(201).json(user);
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!' });
    }
}

usersCtlr.login = async (req, res) => {
    const body = req.body;
    const { error, value } = UserLoginValidation.validate(body, { abortEarly: false });
    if(error) {
        return res.status(400).json({ error: error.details });
    }
    try {
        const user = await User.findOne({ email: value.email });
        if(!user) {
            return res.status(401).json({ error: 'user not found' });
        }
        const passwordMatch = await bcryptjs.compare(value.password, user.password);
        if(!passwordMatch) {
            return res.status(401).json({ error: 'Invalid email/password' });
        }
        user.loginCount += 1;
        await user.save();
        const tokenData = { userId: user._id, role: user.role };
        const token = jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({ token: token });
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}

usersCtlr.list = async (req, res) => {
    try {
        let users;
        if(req.role == "admin") {
            users = await User.find();
        } else {
            users = await User.find({ role: 'user' });
        }
        if(!users) {
            return res.status(404).json({ error: 'user not found' });
        }
        res.json(users);
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}

usersCtlr.remove = async (req, res) => {
    const id = req.params.id;
    try {
        let user;
        if(req.role == "admin") {
            user = await User.findByIdAndDelete(id);
        } else {
            if(id !== req.userId) {
                return res.status(403).json({ error: 'You are not authorized to delete this user' });
            }
            user = await User.findByIdAndDelete(req.userId);
        }
        if(!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ message: 'User deleted successfully', user });
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}

usersCtlr.approveOwner = async(req, res) => { 
    const body = req.body;
    const id = req.params.id;
    const { error, value } = ApproveOwnerValidation.validate(body);
    if(error) {
        return res.status(400).json({ error: error.details });
    }
    try {
        const user = await User.findOne({ _id: id, role: 'owner' });
        if(!user) {
            return res.status(404).json({ error: 'Owner account not found or does not exist' });
        }
        if(value.insuranceDoc && value.licenceDoc) {
            user.insuranceDoc = value.insuranceDoc;
            user.licenceDoc = value.licenceDoc;
            user.insuranceVerified = true;
            user.licenceVerified = true;
            user.isApproved = true;
            await user.save();
        } else {
            return res.status(400).json({ success: false, message: "Your account is pending approval by admin. Document is not provided by owner" });
        }
        res.json({ success: true, message: "Your account is approved by admin" });
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}

usersCtlr.listOwners = async (req, res) => {
    try {
        let owners;
        if(req.role == 'admin') {
           owners = await User.find({ role: 'owner' });
        }
        if(!owners) {
            res.status(400).json({ error: 'owners not found' });
        }
        res.json(owners);
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}

usersCtlr.account = async(req, res) => {
    try {
        const user = await User.findById(req.userId);
        if(!user) {
            return res.status(400).json({ error: 'user not found' });
        }
        res.json(user);
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}

usersCtlr.updateProfile = async (req, res) => {
    const id = req.params.id;
    const body = req.body;
    const { error, value } = UpdateProfileValidation.validate(body);
    if(error) {
        return res.status(400).json({ error: error.details });
    }
    try {
        if(req.role !== 'admin' && id !== req.userId) {
           return res.status(403).json({ error: 'You are not authorized to update this profile' });
        }
        const profile = await User.findOneAndUpdate({ _id: id }, value, { new: true });
        if(!profile) {
            return res.status(404).json({ error: 'profile not found' });
        }
        res.json(profile);
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}

usersCtlr.changePassword = async (req, res) => {  //
    const id = req.params.id;
    const body = req.body;
    const { error, value } = ChangePasswordValidation.validate(body);
    if(error) {
        return res.status(400).json({ error: error.details });
    }
    try {
        const user = await User.findById(id);
        if(!user) {
            return res.status(404).json({ error: 'record not found' });
        }
        const passwordMatch = await bcryptjs.compare(value.password, user.password);
        if(!passwordMatch) {
            return res.status(400).json({ error: 'oldPassword is incorrect' });
        }
        const salt = bcryptjs.genSalt();
        const hash = salt.hash(value.newPassword, salt);
        user.password = hash;
        await user.save();
        res.json({ message: "password updated successfully" });
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}

usersCtlr.search = async (req, res) => {   //
    try {
        const { keyword } = req.body;
        if(!keyword || keyword.trim() == "") {
          return res.status(400).json({ error: "keyword is required" });
        }

        // case-insensitive regex pattern
        const regex = new RegExp(keyword.trim(), "i");

        // serach Owners (role = "owner") by name
        const userFilter = {
            role: "owner",
            isApproved: true,
            $or: [{ username: { $regex: regex } }, { email: { $regex: regex } }]
        }
        const owners = await User.find(userFilter);
        if(owners.length == 0) {
            return res.status(400).json({ message: "No match owners found "});
        }
        res.json(owners);
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}

module.exports = usersCtlr;