const Joi = require('joi');

const PaymentValidation = Joi.object({
    booking: Joi.string().trim().required(),
    user: Joi.string().trim().required(),
    amount: Joi.number().min(0).required(),
    paymentMethod: Joi.string().trim().required(),
    transactionId: Joi.string().trim().required(),
    paymentStatus: Joi.string().trim(),
    refundAmount: Joi.number(),
    refundStatus: Joi.string().trim()
})

module.exports = PaymentValidation;