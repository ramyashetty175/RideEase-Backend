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
    confirmPassword: Joi.string().valid(Joi.ref('password')).required()
})

const UserLoginValidation = Joi.object({
    email: Joi.string().email().trim().lowercase().required(),
    password: passwordComplexity(complexityOptions).required()
})

const ChangePasswordValidation = Joi.object({
    oldPassword: passwordComplexity(complexityOptions).required(),
    newPassword: passwordComplexity(complexityOptions).required()
})

const ApproveOwnerValidation = Joi.object({
    insuranceDoc: Joi.string().uri().required(),
    licenceDoc: Joi.string().uri().required()
})

const UpdateProfileValidation = Joi.object({
    bio: Joi.string().trim().min(10).max(128).optional(),
    avatar: Joi.string().uri().trim().optional()
})

module.exports = {
    UserRegisterValidation,
    UserLoginValidation,
    ChangePasswordValidation,
    ApproveOwnerValidation,
    UpdateProfileValidation
}
