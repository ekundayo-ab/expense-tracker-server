import Boom from 'boom';
import { login, register, checkUserExistence, verifyToken } from '../controllers/UserController';
import { getExpenses, addExpense, updateExpense, deleteExpense } from '../controllers/ExpenseController';
import {
  validateRegister,
  validateLogin,
  validateExpense
} from '../util/validations';

const routes = [
  {
    path: '/',
    method: ['GET', 'POST'],
    handler(req, handler) {
      return handler.response('Welcome to Expense Tracker API!');
    }
  },
  {
    method: ['GET', 'POST'],
    path: '/{any*}',
    handler() {
      return Boom.notFound('Humm!!, this resource isn’t available.');
    }

  },
  {
    path: '/register',
    method: 'POST',
    options: {
      handler: register,
      pre: [{ method: checkUserExistence, assign: 'user' }],
      validate: {
        payload: validateRegister
      }
    },
  },
  {
    path: '/login',
    method: 'POST',
    options: {
      handler: login,
      pre: [{ method: checkUserExistence, assign: 'user' }],
      validate: {
        payload: validateLogin
      }
    },
  },
  {
    path: '/verify-user',
    method: 'GET',
    options: {
      handler: verifyToken,
      auth: 'jwt'
    },
  },
  {
    path: '/expenses',
    method: 'GET',
    options: {
      handler: getExpenses,
      auth: 'jwt'
    }
  },
  {
    path: '/expenses',
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
    path: '/expenses/{id}',
    method: 'PUT',
    options: {
      handler: updateExpense,
      auth: 'jwt'
    },
  },
  {
    path: '/expenses/{id}',
    method: 'DELETE',
    options: {
      handler: deleteExpense,
      auth: 'jwt'
    },
  },
];

export default routes;
