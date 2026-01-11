const Joi = require('joi');

const BookingValidation = Joi.object({
    vehicle: Joi.string().trim().required(),
    startDateTime: Joi.date().greater("now").required(),
    endDateTime: Joi.date().greater(Joi.ref("startDateTime")).required(),
    pickupLocation: Joi.string().trim().optional(),
    returnLocation: Joi.string().trim().invalid(Joi.ref("pickupLocation")).optional(),
    totalAmount: Joi.number().min(1).required()
})

const BookingAvailabilityValidation = Joi.object({
    vehicle: Joi.string().trim().required(),
    startDateTime: Joi.date().iso().required(),
    endDateTime: Joi.date().iso().min(Joi.ref('startDateTime')).required()
})

const BookingUpdateValidation = Joi.object({
    startDateTime: Joi.date().greater("now").optional(),
    endDateTime: Joi.date().greater(Joi.ref("startDateTime")).optional(),
    pickupLocation: Joi.string().trim().optional(),
    returnLocation: Joi.string().trim().invalid(Joi.ref("pickupLocation")).optional()
});

const BookingExtendValidation = Joi.object({
    endDateTime: Joi.date().greater("now").required()
})

module.exports = { BookingValidation, BookingUpdateValidation, BookingAvailabilityValidation, BookingExtendValidation };