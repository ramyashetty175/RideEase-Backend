const Joi = require('joi');

const BookingValidation = Joi.object({
    vehicle: Joi.string().trim().required(),
    startDateTime: Joi.date().greater("now").required(),
    endDateTime: Joi.date().greater(Joi.ref("startDateTime")).required(),
    pickupLocation: Joi.string().trim().required(),
    returnLocation: Joi.string().trim().invalid(Joi.ref("pickupLocation")).required(),
    totalAmount: Joi.number().min(0).required()
})

const BookingAvailabilityValidation = Joi.object({
    vehicle: Joi.string().trim().required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().required()
})

const BookingUpdateValidation = Joi.object({
    startDateTime: Joi.date().greater("now").optional(),
    endDateTime: Joi.date().greater(Joi.ref("startDateTime")).optional(),
    pickupLocation: Joi.string().trim().optional(),
    returnLocation: Joi.string().trim().invalid(Joi.ref("pickupLocation")).optional()
});

const TripActionValidation = Joi.object({
    tripStartTime: Joi.date().optional(),
    tripEndTime: Joi.date().optional()
})

const BookingExtendValidation = Joi.object({
    endDate: Joi.date().required()
})

module.exports = { BookingValidation, BookingUpdateValidation, BookingAvailabilityValidation, TripActionValidation, BookingExtendValidation };