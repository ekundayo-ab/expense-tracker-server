import Hapi from 'hapi';
import HapiAuthJWT from 'hapi-auth-jwt2';
import mongoose from 'mongoose';
import good from 'good';
import dotenv from 'dotenv';

import routes from './routes';
import secret from '../config';
import { validateToken } from './util/validations';

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
  routes: { cors: true }
});

server.route({
  path: '/',
  method: 'POST',
  handler(req, handler) {
    return handler.response('Welcome to HapiJS course!!');
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

  server.route(routes);

  await server.start();
  console.log(`Server running at: ${server.info.uri}`); //eslint-disable-line
};

process.on('unhandledRejection', (err) => {
  console.log(err); //eslint-disable-line
  process.exit(1);
});

init();
