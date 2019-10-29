const Joi = require('@hapi/joi');

module.exports = () => {
  Joi.objectId = require('joi-objectid')(Joi);
};
