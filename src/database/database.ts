import mongoose, { Mongoose } from 'mongoose';

const {
  DB_USER, DB_PASS, DB_NAME,
} = process.env;

// const uriProd = `mongodb+srv://${DB_USER}:${DB_PASS}@surfapi.h3qnx.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;

const uriDev = `mongodb://${DB_USER}:${DB_PASS}@localhost:27017/${DB_NAME}?authSource=admin`;

export const connect = async (): Promise<Mongoose> => {
  mongoose.connection.on('error', () => console.error('Database connection failed'));
  mongoose.connection.once('open', () => console.log('Database connected'));

  return mongoose.connect(uriDev);
};

export const close = (): Promise<void> => mongoose.connection.close();
