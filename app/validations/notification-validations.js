const Joi = require('joi');

const NotificationValidation = Joi.object({
    type: Joi.string().required(),
    title: Joi.string().required(),
    message: Joi.string().required(),
    priority: Joi.string(),
    isRead: Joi.boolean()
})

module.exports = NotificationValidation;