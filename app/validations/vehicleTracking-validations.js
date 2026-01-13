const Joi = require('joi');

const VehicleTrackingValidation = Joi.object({
    latitude: Joi.number().required(),
    longitude: Joi.number().required(),
    speed: Joi.number().optional(),
    maxSpeed: Joi.number().optional(),
    avgSpeed: Joi.number().optional(),
    distanceTravelled: Joi.number().optional(),
    status: Joi.string().valid("moving", "parked", "offline").optional(),
    isLive: Joi.boolean().optional(),
    lastUpdatedAt: Joi.date().optional(),
})

module.exports = VehicleTrackingValidation;