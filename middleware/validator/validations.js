const joi = require("joi");
const registerUserValidation = joi.object({
  email: joi.string().email().required(),
  name: joi.string().required,
  password: joi.string().min(7).required,
  confirmPassword: joi.string().valid(joi.ref("password")).required,
});

const loginUserValidation = joi.object({
  email: joi.string().email().required(),
  password: joi.string().required,
});
const forgotPasswordValidation = joi.object({
  email: joi.string().email().required,
});
const resetPasswordValidations = joi.object({
  email: joi.string().email().required(),
  otp: joi.string().required(),
  newPassword: joi.string().min(7).required,
  confirmNewPassword: joi.string().valid(joi.ref("newPassword")).required(),
});
const updatePasswordValidation = joi.object({
  oldPassword: joi.string().required,
  newPassword: joi.string().valid(joi.ref("oldPassword")).required,
});
module.exports = {
  registerUserValidation,
  loginUserValidation,
  forgotPasswordValidation,
  resetPasswordValidations,
  updatePasswordValidation,
};
