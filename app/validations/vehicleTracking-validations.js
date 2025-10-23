const Joi = require('joi');

const VehicleTrackingValidation = Joi.object({
    latitude: Joi.number().required(),
    longitude: Joi.number().required(),
    speed: Joi.number().required(),
    status: Joi.string().required()
})

module.exports = VehicleTrackingValidation;
