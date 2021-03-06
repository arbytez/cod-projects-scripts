const Joi = require('@hapi/joi');

const mongoObjectId = Joi.objectId().required();

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

exports.validateSearch = search => {
  return Joi.object({
    search: Joi.string()
      .min(1)
      .max(255)
      .required(),
    limit: Joi.number()
      .min(1)
      .default(10)
      .optional(),
    offset: Joi.number()
      .min(0)
      .default(0)
      .optional()
  }).validate(search);
};

exports.validateCommand = command => {
  return Joi.object({
    command: Joi.string()
      .min(1)
      .max(255)
      .required()
  }).validate(command);
};

exports.validatePlayerSearch = player => {
  return Joi.object({
    playerId: Joi.string()
      .min(1)
      .max(255)
      .required()
  }).validate(player);
};

exports.validateCreateAdminOrVipPlayer = adminOrVipPlayer => {
  return Joi.object({
    name: Joi.string()
      .max(255)
      .required(),
    guids: Joi.array()
      .items(
        Joi.string()
          .min(1)
          .max(255)
      )
      .optional()
  }).validate(adminOrVipPlayer);
};

exports.validateUpdateAdminOrVipPlayer = adminOrVipPlayer => {
  return Joi.object({
    id: mongoObjectId,
    name: Joi.string()
      .max(255)
      .optional(),
    guids: Joi.array()
      .items(
        Joi.string()
          .min(1)
          .max(255)
      )
      .optional()
  }).validate(adminOrVipPlayer);
};

exports.validateDeleteAdminOrVipPlayer = adminOrVipPlayer => {
  return Joi.object({
    id: mongoObjectId
  }).validate(adminOrVipPlayer);
};
