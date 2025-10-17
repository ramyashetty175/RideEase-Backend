const Joi = require('joi');

const EarningAnalyticsValidation = Joi.object({
    owner: Joi.string().required(),
    totalEarnings: Joi.number().min(0),
    totalBookings: Joi.number().min(0),
    averageRating: Joi.number().min(0).max(5),
    reportPeriod: Joi.string().trim()
    //topVehicle: Joi.
    //dateRange:
})

module.exports = EarningAnalyticsValidation;