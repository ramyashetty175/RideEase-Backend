const Joi = require('joi');

const BookingValidation = Joi.object({
    vehicle: Joi.string().trim().required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
    pickupLocation: Joi.string().trim().required(),
    returnLocation: Joi.string().trim().required(),
    totalAmount: Joi.number().min(0).required(),
    paymentStatus: Joi.string().trim(),
    bookingStatus: Joi.string().trim(),
    pickupTime: Joi.string().trim(),
    returnTime: Joi.string().trim()
})

const BookingAvailabilityValidation = Joi.object({
    vehicle: Joi.string().trim().required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().required()
})

const BookingApproveValidation = Joi.object({
    bookingStatus: Joi.string().trim().required(),
    paymentStatus: Joi.string().trim(),
    pickupTime: Joi.string().trim().required(),
    returnTime: Joi.string().trim().required()
})

module.exports = { BookingValidation, BookingAvailabilityValidation, BookingApproveValidation };