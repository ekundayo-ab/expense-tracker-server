import mongoose from 'mongoose';
import environment from '../../config/environment';

export const connectAndResetDb = () =>
  mongoose.connect(environment.dbUrl, { useNewUrlParser: true })
    .then(() => {
      mongoose.connection.dropDatabase();
    });

export default {
  connectAndResetDb
};
