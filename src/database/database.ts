import "dotenv/config";
import config from "config";
import mongoose, { Mongoose } from "mongoose";

import { IDatabaseConfig } from "@config/types/configTypes";
import { SetupServer } from "@src/Server";

const { DB_USER, DB_PASS } = process.env;

const database = config.get<IDatabaseConfig>("App.database");

console.log(database.uri);

mongoose.connection.on("error", async () => {
  const server = new SetupServer();
  console.error("\x1b[31m%s\x1b[0m", "Database connection failed");

  await server.close();
});

mongoose.connection.once("open", async () =>
  console.log("\x1b[32m%s\x1b[0m", "Database connected")
);

export const connect = async (): Promise<Mongoose> =>
  mongoose.connect(database.uri, {
    auth: {
      username: DB_USER,
      password: DB_PASS,
    },
  });

export const close = (): Promise<void> => {
  console.log("\x1b[32m%s\x1b[0m", "Database disconnected");

  return mongoose.connection.close();
};
