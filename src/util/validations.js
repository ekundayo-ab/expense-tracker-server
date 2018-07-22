import Joi from 'joi';

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
  title: Joi.string().min(2).max(30).required(),
  description: Joi.string().required(),
  amount: Joi.string().required(),
  date: Joi.date().required()
});


const validateToken = (decoded, req, h) => ({ isValid: true, credentials: { decoded }, h });

export {
  validateToken,
  validateRegister,
  validateLogin,
  validateExpense
};
