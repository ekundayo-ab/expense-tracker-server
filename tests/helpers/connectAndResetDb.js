import mongoose from 'mongoose';
import { dbUrl } from '../../config';

export const connectAndResetDb = () =>
  mongoose.connect(dbUrl, { useNewUrlParser: true })
    .then(() => {
      mongoose.connection.dropDatabase();
    });

export default {
  connectAndResetDb
};
