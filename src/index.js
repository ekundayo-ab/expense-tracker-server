const Hapi = require('hapi');
const mongoose = require('mongoose');
const routes = require('./routes');
const secret = require('../config');
const validateToken = require('./util/validations');

const mongoDbUri = 'mongodb://localhost:27017/expense-tracker';
mongoose.connect(mongoDbUri, { useNewUrlParser: true });
mongoose.connection.on('connected', () => {
  console.log(`app is connected to ${mongoDbUri}`);
});
mongoose.connection.on('error', err => {
  console.log('error while connecting to mongodb', err);
})

const server = new Hapi.Server({
  host: 'localhost',
  port: 3000
});

server.route({
  path: '/',
  method: 'GET',
  handler(req, h) {
    return h.response('Welcome to HapiJS course!!');
  }
});

server.route(routes);

const init = async () => {
  await server.register({
    plugin: require('hapi-auth-jwt2')
  });
  server.auth.strategy('jwt', 'jwt', {
    key: secret,
    verifyOptions: { algorithms: ['HS256'] },
    validate: validateToken,
  });
  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();
