import relish from 'relish';
import { login, register, verifyUniqueUser, verifyToken } from '../controllers/UserController';
import { getExpenses, addExpense, updateExpense, deleteExpense } from '../controllers/ExpenseController';
import {
  validateRegister,
  validateLogin,
  validateExpense
} from '../util/validations';

const Relish = relish({});

const routes = [
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
    path: '/api/verify-user',
    method: 'GET',
    options: {
      handler: verifyToken,
      auth: 'jwt'
    },
  },
  {
    path: '/api/expenses',
    method: 'GET',
    options: {
      handler: getExpenses,
      auth: 'jwt'
    }
  },
  {
    path: '/api/expenses',
    method: 'POST',
    options: {
      handler: addExpense,
      auth: 'jwt',
      validate: {
        payload: validateExpense,
        failAction: Relish.failAction
      }
    },
  },
  {
    path: '/api/expenses/{id}',
    method: 'PUT',
    options: {
      handler: updateExpense,
      auth: 'jwt'
    },
  },
  {
    path: '/api/expenses/{id}',
    method: 'DELETE',
    options: {
      handler: deleteExpense,
      auth: 'jwt'
    },
  },
];

export default routes;
