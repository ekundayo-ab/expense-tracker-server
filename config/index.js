const dotenv = require('dotenv');

dotenv.config();

const secret = process.env.SECRET_KEY;

const { TEST_DB_URL, DEV_DB_URL, PROD_DB_URL } = process.env;
const envDbUrls = {
  test: TEST_DB_URL,
  development: DEV_DB_URL,
  production: PROD_DB_URL
};

module.exports = {
  dbUrl: envDbUrls[process.env.NODE_ENV || 'development'],
  secret
};
