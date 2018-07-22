import Hapi from 'hapi';
import HapiAuthJWT from 'hapi-auth-jwt2';
import mongoose from 'mongoose';
import morgan from 'morgan';
import routes from './routes';
import secret from '../config';
import { validateToken } from './util/validations';

const mongoDbUri = 'mongodb://localhost:27017/expense-tracker';
mongoose.connect(mongoDbUri, { useNewUrlParser: true });
mongoose.connection.on('connected', () => {
  console.log(`app is connected to ${mongoDbUri}`);
});
mongoose.connection.on('error', err =>
  console.log('error while connecting to mongodb', err));

const server = new Hapi.Server({
  host: 'localhost',
  port: 3000,
  routes: { cors: true }
});

server.route({
  path: '/',
  method: 'GET',
  handler(req, h) {
    return h.response('Welcome to HapiJS course!!');
  }
});

const init = async () => {
  await server.register({
    plugin: HapiAuthJWT
  });

  server.auth.strategy('jwt', 'jwt', {
    key: secret,
    verifyOptions: { algorithms: ['HS256'] },
    validate: validateToken,
  });

  server.route(routes);

  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();
