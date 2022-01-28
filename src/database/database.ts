import config from "config";
import mongoose, { Mongoose } from "mongoose";

import { IDatabaseConfig } from "@config/types/configTypes";
import logger from "@src/log/logger";
import { SetupServer } from "@src/Server";

const database = config.get<IDatabaseConfig>("App.database");

mongoose.connection.on("error", async () => {
  const server = new SetupServer();
  logger.error("Database connection failed");

  await server.close();
});

mongoose.connection.once("open", async () => logger.info("Database connected"));

export const connect = async (): Promise<Mongoose> =>
  mongoose.connect(database.uri);

export const close = (): Promise<void> => {
  logger.info("Database disconnected");

  return mongoose.connection.close();
};
