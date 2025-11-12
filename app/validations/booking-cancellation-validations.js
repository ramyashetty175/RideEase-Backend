const Joi = require('joi');

const BookingCancellationValidation = Joi.object({
    cancelledBy: Joi.string().valid("user", "owner", "admin").required(),
    reason: Joi.string().required(),
    cancelledAt: Joi.date().required(),
    status: Joi.string().valid("pending", "approved", "rejected").required(),
    refundAmount: Joi.number().min(0).required(),
    penaltyAmount: Joi.number().min(0).required(),
    paymentStatus: Joi.string().valid("not_processed", "refunded", "failed").required(),
    remarks: Joi.string().optional()
})

module.exports = BookingCancellationValidation;
