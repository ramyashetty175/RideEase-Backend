const Joi = require('joi');

const BookingValidation = Joi.object({
    vehicle: Joi.string().trim().required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
    pickupLocation: Joi.string().trim().required(),
    returnLocation: Joi.string().trim().required(),
    totalAmount: Joi.number().min(0).required(),
    pickupTime: Joi.string().trim().required(),
    returnTime: Joi.string().trim().required()
})

const BookingAvailabilityValidation = Joi.object({
    vehicle: Joi.string().trim().required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().required()
})

const BookingApproveValidation = Joi.object({
    pickupTime: Joi.string().trim().required(),
    returnTime: Joi.string().trim().required(),
})

module.exports = { BookingValidation, BookingAvailabilityValidation, BookingApproveValidation };