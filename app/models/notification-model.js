const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    userId: {
       type: mongoose.Schema.ObjectId,
       ref: 'User'
    },
    senderId: {
       type: mongoose.Schema.ObjectId,
       ref: 'User'
    },
    vehicleId: {
       type: mongoose.Schema.ObjectId,
       ref: 'Vehicle'
    },
    relatedId: {
       type: mongoose.Schema.ObjectId,
       refPath: "relatedModel"
    },
    relatedModel: {
       type: String,
       enum: ["Booking", "Payment", "BookingCancellation", "VehicleReturn", "SpeedAlert", "System"]
    },
    type: {
       type: String,
       enum: [
        "booking_created",
        "booking_canceled",
        "payment_success",
        "payment_failed",
        "speed_alert",
        "vehicle_return",
        "refund_processed",
        "penalty_applied",
        "system",
      ]
    },
    title: String,
    message: String,
    priority: {
       type: String,
       enum: ["low", "medium", "high"],
       default: "medium"
    },
    isRead: {
       type: Boolean,
       default: false
    },
    readAt: Date
}, { timestamps: true });

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;