const Joi = require('joi');

const NotificationValidation = Joi.object({
    type: Joi.string().required(),
    title: Joi.string().required(),
    message: Joi.string().required(),
    priority: Joi.string(),
    userId: Joi.string(),
    relatedId: Joi.string(), 
    relatedModel: Joi.string(),
    isRead: Joi.boolean()
})

module.exports = NotificationValidation;