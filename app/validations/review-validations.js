const Joi = require('joi');

const ReviewValidation = Joi.object({
    user: Joi.string().trim().required(),
    vehicle: Joi.string().trim().required(),
    rating: Joi.number().min(1).max(5).required(),
    comment: Joi.string().min(10).max(500).trim()
})

module.exports = ReviewValidation;