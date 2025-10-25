const Joi= require('joi');

const VehicleValidation = Joi.object({
    vehicleName: Joi.string().trim().required(),
    brand: Joi.string().trim().required(),
    type: Joi.string().trim().required(),
    registrationNumber: Joi.string().trim().required(),
    license: Joi.string().required(),
    fuelType: Joi.string().trim().required(),
    transmission: Joi.string().trim().required(),
    seats: Joi.number().min(1).required(),
    pricePerDay: Joi.number().required(),
    location: Joi.string().required(),
    images: Joi.array().ordered(Joi.string().required()),
    availabilityStatus: Joi.string().trim(),
    averageRating: Joi.number()
})

module.exports = VehicleValidation;
