const Joi = require('joi');

const BookingCancellationValidation = Joi.object({
    reason: Joi.string().required(),
    remarks: Joi.string().optional(),
    refundAmount: Joi.number().min(0).optional(),
    penaltyAmount: Joi.number().min(0).optional(),
    status: Joi.string().valid("pending", "approved", "rejected").optional()
})

const BookingCancelActionValidation = Joi.object({
    reason: Joi.string().required(),
    remarks: Joi.string().optional()
})

module.exports = {
    BookingCancellationValidation,
    BookingCancelActionValidation
}
