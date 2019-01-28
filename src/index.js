import Hapi from 'hapi';
import HapiAuthJWT from 'hapi-auth-jwt2';
import mongoose from 'mongoose';
import good from 'good';
import dotenv from 'dotenv';
import relish from 'relish';
import lout from 'lout';
import inert from 'inert';
import vision from 'vision';

import routes from './routes';
import { secret, dbUrl } from '../config';
import { validateToken } from './util/validations';
import { validationErrorParser } from './util/parser';

dotenv.config();

mongoose.connect(dbUrl, { useNewUrlParser: true });
mongoose.connection.on('connected', () => {
  console.log(`app is connected to the database`); //eslint-disable-line
});
mongoose.connection.on('error', err =>
  console.log('error while connecting to mongodb', err)); //eslint-disable-line

export const server = new Hapi.Server({
  port: process.env.PORT || 8000,
  routes: {
    cors: true,
    validate: { failAction: relish({ stripQuotes: true }).failAction }
  }
});

const options = {
  includes: {
    request: ['headers', 'payload'],
  },
  ops: false,
  reporters: {
    reporter: [{
      module: 'good-console',
      args: [{ log: '*', response: '*', request: '*' }],
    }, 'stdout']
  }
};

const init = async () => {
  await server.register([
    { plugin: HapiAuthJWT },
    { plugin: good, options },
    { plugin: lout },
    { plugin: inert },
    { plugin: vision },
  ]);

  server.auth.strategy('jwt', 'jwt', {
    key: secret,
    verifyOptions: { algorithms: ['HS256'] },
    validate: validateToken,
  });

  server.ext({
    type: 'onPreResponse',
    method: (request, h) => validationErrorParser(request, h)
  });

  server.route({
    method: ['GET', 'POST'],
    path: '/{any*}',
    handler(req, h) {
      return h.redirect('/docs');
    },
    options: { plugins: { lout: false } }
  });

  server.realm.modifiers.route.prefix = '/api';
  server.route(routes);

  await server.start();

  console.log(`Server running at: ${server.info.uri}`); //eslint-disable-line
};

process.on('unhandledRejection', (err) => {
  console.log(err); //eslint-disable-line
  process.exit(1);
});

init();

export default {
  server
};
