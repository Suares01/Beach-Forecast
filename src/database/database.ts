import { IDatabase } from '@config/types/configTypes';
import config from 'config';
import mongoose, { Mongoose } from 'mongoose';

const dbConfig = config.get<IDatabase>('App.database');

export const connect = async (): Promise<Mongoose> => {
  mongoose.connection.on('error', () => console.error('Database connection error'));
  mongoose.connection.on('open', () => console.log('Database conected'));
  return mongoose.connect(dbConfig.mongoUrl);
};

export const close = (): Promise<void> => mongoose.connection.close();
