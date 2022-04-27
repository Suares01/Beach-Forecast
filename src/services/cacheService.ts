import config from "config";
import { createClient } from "redis";

import { ICache } from "@config/types/configTypes";
import logger from "@src/log/logger";
import { InternalError } from "@src/util/errors/InternalError";

const cacheConfig = config.get<ICache>("App.cache");

const cacheService = createClient({
  url: cacheConfig.url,
  password: cacheConfig.pass,
});

export const connect = async (): Promise<void> => await cacheService.connect();

export const disconnect = async (): Promise<void> => await cacheService.quit();

cacheService.on("ready", () => logger.info("Cache Service connected"));

cacheService.on("end", () => logger.info("Cache Service disconnected"));

cacheService.on("error", (error) => {
  throw new InternalError(`Cache service error: ${error.message}`);
});

export default cacheService;
