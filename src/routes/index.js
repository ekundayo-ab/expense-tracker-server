import Boom from 'boom';
import { login, register, verifyUniqueUser, verifyToken } from '../controllers/UserController';
import { getExpenses, addExpense, updateExpense, deleteExpense } from '../controllers/ExpenseController';
import {
  validateRegister,
  validateLogin,
  validateExpense
} from '../util/validations';

const routes = [
  {
    method: ['GET', 'POST'],
    path: '/{any*}',
    handler() {
      return Boom.notFound('Humm!!, this resource isn’t available.');
    }

  },
  {
    path: '/',
    method: 'POST',
    handler(req, handler) {
      return handler.response('Welcome to Expense Tracker API!');
    }
  },
  {
    path: '/api/register',
    method: 'POST',
    options: {
      handler: register,
      pre: [{ method: verifyUniqueUser }],
      validate: {
        payload: validateRegister
      }
    },
  },
  {
    path: '/api/login',
    method: 'POST',
    options: {
      handler: login,
      validate: {
        payload: validateLogin
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
        payload: validateExpense
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
