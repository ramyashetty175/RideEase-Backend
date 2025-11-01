const Joi = require('joi');
const passwordComplexity = require('joi-password-complexity');

const complexityOptions = {
    min: 5,
    max: 10,
    lowerCase: 1,
    upperCase: 1,
    numeric: 1,
    symbol: 1,
    requiredCount: 6
}

const UserRegisterValidation = Joi.object({
    username: Joi.string().trim().min(5).max(10).required(),
    email: Joi.string().email().trim().lowercase().required(),
    password: passwordComplexity(complexityOptions).required(),
    role: Joi.string()
})

const UserLoginValidation = Joi.object({
    email: Joi.string().email().trim().lowercase().required(),
    password: passwordComplexity(complexityOptions).required()
})

const ApproveOwnerValidation = Joi.object({
    //role: Joi.string().valid('owner').required(),
    isApproved: Joi.boolean().required()
})

module.exports = {
    UserRegisterValidation,
    UserLoginValidation,
    ApproveOwnerValidation
}
