import Joi from 'joi';

const validateRegister = Joi.object({
  username: Joi.string().alphanum().min(2).max(30).required(),
  email: Joi.string().email(),
  password: Joi.string().min(6).max(200).required()
});

const validateLogin = Joi.object().keys({
  username: Joi.string().alphanum().min(2).max(30).required(),
  email: Joi.string().email(),
  password: Joi.string().required()
}).or('username', 'email');

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
