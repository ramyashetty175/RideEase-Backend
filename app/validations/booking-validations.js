const Joi = require('joi');

const BookingValidation = Joi.object({
    vehicle: Joi.string().trim().required(),
    startDateTime: Joi.date().greater("now").required(),
    endDateTime: Joi.date().greater(Joi.ref("startDateTime")).required(),
    pickupLocation: Joi.string().trim().required(),
    returnLocation: Joi.string().trim().required()
})

module.exports = { BookingValidation };