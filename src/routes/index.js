const Relish = require('relish')({});
const { login, register, verifyUniqueUser } = require('../controllers/UserController');
const { getExpenses, addExpense } = require('../controllers/ExpenseController');
const {
  validateRegister,
  validateLogin,
} = require('../util/validations');

module.exports = [
  {
    path: '/api/register',
    method: 'POST',
    options: {
      handler: register,
      pre: [{ method: verifyUniqueUser }],
      validate: {
        payload: validateRegister,
        failAction: Relish.failAction
      }
    },
  },
  {
    path: '/api/login',
    method: 'POST',
    options: {
      handler: login,
      validate: {
        payload: validateLogin,
        failAction: Relish.failAction
      }
    },
  },
  {
    path: '/api/expenses',
    method: 'GET',
    options: {
      handler: getExpenses,
    },
  },
  {
    path: '/api/expenses',
    method: 'POST',
    options: {
      handler: addExpense,
    },
  },
];
