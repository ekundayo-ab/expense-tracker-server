const Joi = require('joi');

const validateRegister = Joi.object({
  username: Joi.string().alphanum().min(2).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const validateLogin = Joi.alternatives().try(
  Joi.object({
    username: Joi.string().alphanum().min(2).max(30).required(),
    password: Joi.string().required()
  }),
  Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  })
);

const validateExpense = Joi.object({
  title: Joi.string().alphanum().min(2).max(30).required(),
  description: Joi.string().required(),
  amount: Joi.string().required(),
  date: Joi.string().required()
});


const validateToken = async function (decoded, request) {
  // do your checks to see if the person is valid
  if (!people[decoded.id]) {
    return { isValid: false };
  }
  else {
    return { isValid: true };
  }
};

module.exports = {
  validateToken,
  validateRegister,
  validateLogin,
  validateExpense
};
