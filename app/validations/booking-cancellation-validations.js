const Joi = require('joi');

const BookingCancellationValidation = Joi.object({
    remarks: Joi.string().optional(),
    refundAmount: Joi.number().min(0).optional(),
    penaltyAmount: Joi.number().min(0).optional(),
    status: Joi.string().optional()
})

const BookingCancelValidation = Joi.object({
    status: Joi.string().valid("approved", "rejected").required(),
    remarks: Joi.string().optional()
})

module.exports = {
    BookingCancellationValidation,
    BookingCancelValidation
}