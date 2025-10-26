const Joi = require('joi');

const SubscriptionValidation = Joi.object({
    user: Joi.string().trim().required(),
    planType: Joi.string().trim().required(),
    price: Joi.number().min(0).required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
    isActive: Joi.string().required(),
    features: Joi.array().ordered(Joi.string().required()),
    paymentStatus: Joi.string().trim()
})

module.exports = SubscriptionValidation;