import Hapi from 'hapi';
import HapiAuthJWT from 'hapi-auth-jwt2';
import mongoose from 'mongoose';
import good from 'good';
import dotenv from 'dotenv';
import relish from 'relish';

import routes from './routes';
import secret from '../config';
import { validateToken } from './util/validations';
import { validationErrorParser } from './util/parser';

dotenv.config();

const mongoDbUri = process.env.DB_URL;
mongoose.connect(mongoDbUri, { useNewUrlParser: true });
mongoose.connection.on('connected', () => {
  console.log(`app is connected to ${mongoDbUri}`); //eslint-disable-line
});
mongoose.connection.on('error', err =>
  console.log('error while connecting to mongodb', err)); //eslint-disable-line

const server = new Hapi.Server({
  host: process.env.HOST || 'localhost',
  port: process.env.PORT || 8000,
  routes: {
    cors: true,
    validate: { failAction: relish({ stripQuotes: true }).failAction }
  }
});

const options = {
  includes: {
    request: ['headers', 'payload'],
    // response: ['headers', 'payload']
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
    {
      plugin: HapiAuthJWT
    },
    {
      plugin: good,
      options
    }
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

  server.route(routes);

  await server.start();

  console.log(`Server running at: ${server.info.uri}`); //eslint-disable-line
};

process.on('unhandledRejection', (err) => {
  console.log(err); //eslint-disable-line
  process.exit(1);
});

init();
