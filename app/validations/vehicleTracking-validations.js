const Joi = require('joi');

const VehicleTrackingValidation = Joi.object({
    // latitude: Joi.number().required(),
    // longitude: Joi.number().required(),
    // speed: Joi.number().required(),
    maxSpeed: Joi.number(),
    avgSpeed: Joi.number(),
    distanceTravelled: Joi.number(),
    // status: Joi.string().required(),
    isLive: Joi.boolean(),
    lastUpdatedAt: Joi.date(),
})

module.exports = VehicleTrackingValidation;