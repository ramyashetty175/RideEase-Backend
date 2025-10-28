const Joi = require('joi');

const BookingCancellationValidation = Joi.object({
    cancelledBy: Joi.string().required(),
    reason: Joi.string().required(),
    cancelledAt: Joi.date().required(),
    status: Joi.string().required(),
    refundAmout: Joi.number().required(),
    penaltyAmount: Joi.number().required(),
    paymentStatus: Joi.string().required(),
    remarks: Joi.string().required()
})

module.exports = BookingCancellationValidation;