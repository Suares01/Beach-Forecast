import config from "config";
import mongoose, { Mongoose } from "mongoose";

import { IDatabaseConfig } from "@config/types/configTypes";
import logger from "@src/log/logger";

const database = config.get<IDatabaseConfig>("App.database");

mongoose.connection.on("error", (error) =>
  logger.error(`Database error: ${error}`)
);

mongoose.connection.on("open", () => logger.info("Database connected"));

mongoose.connection.on("disconnected", () =>
  logger.info("Database disconnected")
);

export const connect = async (): Promise<Mongoose> =>
  await mongoose.connect(database.uri);

export const close = async (): Promise<void> =>
  await mongoose.connection.close();
