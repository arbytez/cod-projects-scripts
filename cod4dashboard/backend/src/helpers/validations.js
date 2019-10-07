const Joi = require('@hapi/joi');

const username = Joi.string()
  .min(3)
  .max(50)
  .required();

const email = Joi.string()
  .min(1)
  .max(255)
  .email()
  .required();

const password = Joi.string()
  .min(5)
  .max(255)
  .required();

exports.validate = objToValidate => validator => {
  const { error } = validator(objToValidate);
  if (error) {
    throw new Error(error.details[0].message);
  }
};

exports.validateUser = user => {
  return Joi.object({
    username,
    email,
    password
  }).validate(user);
};

exports.validateSignInUser = user => {
  return Joi.object({
    email,
    password
  }).validate(user);
};
