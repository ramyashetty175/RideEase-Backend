const User = require('../models/user-Authmodel');
const { UserRegisterValidation, UserLoginValidation, ChangePasswordValidation, ApproveOwnerValidation, UpdateProfileValidation } = require('../validations/user-Authvalidations');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const usersCtlr = {};

// User Registartion
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
            user.status = "approved";
        } else if(userCount > 0 && userCount <= 5) {
            user.role = "owner";
            user.status = "pending";
        } else {
            user.role = "user";
            user.status = "approved";
        }
        await user.save();
        res.status(201).json(user);
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!' });
    }
}

// User Login
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

// Users List
usersCtlr.list = async (req, res) => {
    try {
        let users;
        if(req.role == "admin") {
            users = await User.find();
        } else if(req.role == 'owner'){
            users = await User.find({ role: 'user' });
        }
        if(users.length == 0) {
            return res.status(404).json({ error: 'users not found' });
        }
        res.json(users);
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}

// User Remove
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

// Owner Approve
usersCtlr.approveOwner = async (req, res) => { 
    const id = req.params.id;
    try {
        const user = await User.findOne({ _id: id, role: 'owner' });
        if(!user) {
            return res.status(404).json({ error: 'Owner account not found or does not exist' });
        }
        if(user.insuranceDoc && user.licenceDoc) {
            user.licenceVerified = true;
            user.insuranceVerified = true;
            user.status = "approved";
        } else {
            return res.status(400).json({ success: true, message: "Your account is not approved by Admin" });
        }
        await user.save();
        res.status(200).json({ success: true, message: "Your account is approved by Admin" });
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}

// Owner Reject
usersCtlr.rejectOwner = async (req, res) => {
    const id = req.params.id;
    try {
        const user = await User.findOne({ _id: id, role: 'owner' });
        if(!user) {
            return res.status(404).json({ error: 'Owner account not found or does not exist' });
        }
        if(!user.licenceDoc && !user.insuranceDoc) {
           user.insuranceVerified = false;
           user.licenceVerified = false;
           user.status = "rejected";
        } else {
            return res.status(200).json({ success: true, message: "Your account is not rejected by Admin" });
        }
        await user.save();
        res.status(200).json({ success: true, message: "Your account is rejected by admin" });
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}

// List Owners
usersCtlr.listOwners = async (req, res) => {
    try {
        const owners = await User.find({ role: 'owner' });
        res.json(owners);
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}

// List All Users
usersCtlr.listUsers = async (req, res) => {
    try {
        const users = await User.find({ role: 'user' });
        res.json(users);
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}

// User Profile
usersCtlr.profile = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if(!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
};

// Update Profile
usersCtlr.updateProfile = async (req, res) => {
    const body = req.body;
    const { error, value } = UpdateProfileValidation.validate(body);
    if(error) {
        return res.status(400).json({ error: error.details });
    }
    try {
        const profile = await User.findOneAndUpdate({ _id: req.userId }, value, { new: true });
        if(!profile) {
            return res.status(404).json({ error: 'profile not found' });
        }
        res.json(profile);
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}

// Change Password
usersCtlr.changePassword = async (req, res) => {  
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
        const passwordMatch = await bcryptjs.compare(value.oldpassword, user.password);
        if(!passwordMatch) {
            return res.status(400).json({ error: 'oldPassword is incorrect' });
        }
        const salt = await bcryptjs.genSalt();
        const hash = await bcryptjs.hash(value.newpassword, salt);
        user.password = hash;
        await user.save();
        res.json({ message: "password updated successfully" });
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}

module.exports = usersCtlr;