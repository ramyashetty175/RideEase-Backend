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
    role: Joi.string().trim().valid("owner", "user")
})

const UserLoginValidation = Joi.object({
    email: Joi.string().email().trim().lowercase().required(),
    password: passwordComplexity(complexityOptions).required()
})

const ChangePasswordValidation = Joi.object({
    Password: passwordComplexity(complexityOptions).required(),
    newPassword: passwordComplexity(complexityOptions).required()
})

const ApproveOwnerValidation = Joi.object({
    insuranceDoc: Joi.string().required(),
    licenceDoc: Joi.string().required()
})

const UpdateProfileValidation = Joi.object({
    name: Joi.string().trim().required(),
    email: Joi.string().email().trim().lowercase().required(),
    bio: Joi.string().trim().min(10).max(128).required(),
    avatar: Joi.string().uri().trim().optional()
})

module.exports = {
    UserRegisterValidation,
    UserLoginValidation,
    ChangePasswordValidation,
    ApproveOwnerValidation,
    UpdateProfileValidation
}
