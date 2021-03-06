import config from "config";
import mongoose, { Mongoose } from "mongoose";

import { IDatabaseConfig } from "@config/types/configTypes";
import { InternalError } from "@shared/errors/InternalError";
import logger from "@shared/logger";

const database = config.get<IDatabaseConfig>("App.database");

mongoose.connection.on("error", (error) => {
  throw new InternalError(error.message);
});

mongoose.connection.on("open", () => logger.info("Database connected"));

mongoose.connection.on("disconnected", () =>
  logger.info("Database disconnected")
);

export const connect = async (): Promise<Mongoose> =>
  await mongoose.connect(database.url);

export const close = async (): Promise<void> =>
  await mongoose.connection.close();
