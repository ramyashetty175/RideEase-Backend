const Joi= require('joi');

const VehicleValidation = Joi.object({
    owner: Joi.string().trim().min(8).max(15).required(),
    vehicleName: Joi.string().trim().required(),
    brand: Joi.string().trim().required(),
    type: Joi.string().trim().required(),
    registrationNumber: Joi.string().trim().required(),
    fuelType: Joi.string().trim().required(),
    transmission: Joi.string().trim().required(),
    seats: Joi.number().min(1).required(),
    pricePerDay: Joi.number().required(),
    location: Joi.string().required(),
    images: Joi.string(),
    availabilityStatus: Joi.string().trim(),
    averageRating: Joi.string()
})

module.exports = VehicleValidation;
