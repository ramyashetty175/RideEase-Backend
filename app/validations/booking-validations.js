const Joi = require('joi');

const BookingValidation = Joi.object({
    vehicle: Joi.string().trim().required(),
    startDateTime: Joi.date().greater("now").required(),
    endDateTime: Joi.date().greater(Joi.ref("startDateTime")).required(),
    pickupLocation: Joi.string().trim().required(),
    returnLocation: Joi.string().trim().required()
})

const BookingUpdateValidation = Joi.object({
    startDateTime: Joi.date().greater("now").optional(),
    endDateTime: Joi.date().greater(Joi.ref("startDateTime")).optional(),
    pickupLocation: Joi.string().trim().optional(),
    returnLocation: Joi.string().trim().invalid(Joi.ref("pickupLocation")).optional()
})

module.exports = { BookingValidation, BookingUpdateValidation };