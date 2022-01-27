import config from "config";
import mongoose, { Mongoose } from "mongoose";

import { IDatabaseConfig } from "@config/types/configTypes";
import { SetupServer } from "@src/Server";

const database = config.get<IDatabaseConfig>("App.database");

console.log("\x1b[31m%s\x1b[0m", database.uri);

mongoose.connection.on("error", async () => {
  const server = new SetupServer();
  console.error("\x1b[31m%s\x1b[0m", "Database connection failed");

  await server.close();
});

mongoose.connection.once("open", async () =>
  console.log("\x1b[32m%s\x1b[0m", "Database connected")
);

export const connect = async (): Promise<Mongoose> =>
  mongoose.connect(database.uri);

export const close = (): Promise<void> => {
  console.log("\x1b[32m%s\x1b[0m", "Database disconnected");

  return mongoose.connection.close();
};
