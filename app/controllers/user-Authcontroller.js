const User = require('../models/user-Authmodel');
const { UserRegisterValidation, UserLoginValidation } = require('../validations/user-Authvalidations');
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
           return res.status(404).json({ msg: 'email already exists' });
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
        }
        await user.save();
        res.status(201).json(user);
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!' });
    }
}

usersCtlr.login = async(req, res) => {
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

usersCtlr.account = async(req, res) => {
    try {
        const user = await User.findById(req.userId);
        res.json(user);
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}

usersCtlr.list = async(req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}

usersCtlr.remove = async(req, res) => {
    const id = req.params.id;
    try {
        const user = await User.findByIdAndDelete(id);
        res.json(user);
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}

module.exports = usersCtlr;