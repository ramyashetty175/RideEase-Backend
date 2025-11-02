const Notification = require('../models/notification-model');
const NotificationValidation = require('../validations/notification-validations');

const notificationCtlr = {};

notificationCtlr.create = async(req, res) => {
    const body = req.body;
    const { error, value } = NotificationValidation.validate(body, { abortEarly: true });
    if(error) {
        res.status(400).json({ error: error.details });
    }
    try {
        // const existingNotification = await Notification.findOne({ type: value.type, vehicleId, userId, 5 min ,user: req.userId });
        // if(existingNotification) {
        //     res.status(400).json({ error: 'notification already exists' });
        // }
        const notification = new Notification();
        notification.senderId = req.userId;
        notification.userId = value.userId;
        notification.relatedId = value.relatedId;
        notification.relatedModel = value.relatedModel;
        notification.type = value.type;
        notification.title = value.title;
        notification.message = value.message;
        notification.priority = value.priority;
        notification.isRead = value.isRead;
        await notification.save();
        res.status(201).json(notification);
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}

notificationCtlr.list = async(req, res) => {
    try {
        const notification = await Notification.find({ user: req.userId });
        if(!notification) {
            res.status(404).json({ error: 'record not found' });
        }
        res.json(notification);
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}

notificationCtlr.show = async(req, res) => {
    const id = req.params.id;
    try {
        const notification = await Notification.findOne({ _id: id, user: req.userId });
        if(!notification) {
            res.status(400).json({ error: 'record not found' });
        }
        res.json(notification);
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}

notificationCtlr.update = async(req, res) => {
    const body = req.body;
    const id = req.params.id;
    const { error, value } = NotificationValidation.validate(body);
    if(error) {
        res.status(400).json({ error: error.details });
    }
    try {
        const notification = await Notification.findOneAndUpdate({ _id: id, user: req.userId}, value, { new: true });
        if(!notification) {
            res.status(404).json({ error: 'record not found' });
        }
        res.json(notification);
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}

notificationCtlr.remove = async(req, res) => {
    const id = req.params.id;
    try {
        const notification = await Notification.findOne({ _id: id, user: req.userId });
        if(!notification) {
            res.status(404).json({ error: 'record not found' });
        }
        res.json(notification);
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}

module.exports = notificationCtlr;