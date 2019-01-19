import dotenv from 'dotenv';

dotenv.config();

const { TEST_DB_URL, DEV_DB_URL, PROD_DB_URL } = process.env;

const envDbUrls = {
  test: TEST_DB_URL,
  development: DEV_DB_URL,
  production: PROD_DB_URL
};

export default {
  dbUrl: envDbUrls[process.env.NODE_ENV || 'development']
};
