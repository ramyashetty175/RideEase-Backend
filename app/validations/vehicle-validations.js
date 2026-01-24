const Joi= require('joi');

const VehicleValidation = Joi.object({
    vehicleName: Joi.string().trim().required(),
    brand: Joi.string().trim().required(),
    type: Joi.string().trim().valid("Car", "Bike").required(),
    registrationNumber: Joi.string().trim().required(),
    licenseDoc: Joi.string().uri().required(),
    insuranceDoc: Joi.string().uri().required(),
    fuelType: Joi.string().trim().valid("Petrol", "Diesel", "Electric").required(),
    transmission: Joi.string().trim().valid("Manual", "Electric").required(),
    seats: Joi.number().min(1).required(),
    pricePerDay: Joi.number().required(),
    location: Joi.string().required(),
    image: Joi.string().uri().required(),
    availabilityStatus: Joi.string().trim().valid("Available", "Booked", "Maintainance", "unAvailable").required(),
    averageRating: Joi.number().min(0).max(5).optional()
})

module.exports = { VehicleValidation };