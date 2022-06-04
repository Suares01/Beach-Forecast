import config from "config";
import Redis from "ioredis";

import { ICache } from "@config/types/configTypes";
import { InternalError } from "@shared/errors/InternalError";
import logger from "@shared/logger";

import { ICacheService } from "../ICacheService";

const cacheConfig = config.get<ICache>("App.cache");

const redisClient = new Redis(cacheConfig.url, {
  password: cacheConfig.pass,
  lazyConnect: true,
});

redisClient.on("connect", () => logger.info("Cache Service connected"));

redisClient.on("close", () => logger.info("Cache Service disconnected"));

redisClient.on("error", (error) => {
  throw new InternalError(`Cache service error: ${error.message}`);
});

export class CacheRedisService implements ICacheService {
  constructor(private cacheService = redisClient) {}

  public async connect(): Promise<void> {
    await this.cacheService.connect();
  }

  public async disconnect(): Promise<void> {
    await this.cacheService.quit();
  }

  public async set<T = any>(key: string, value: T, ttl: number): Promise<void> {
    await this.cacheService.set(key, JSON.stringify(value), "EX", ttl);
  }

  public async get<T = any>(key: string): Promise<T | undefined> {
    const stringValue = await this.cacheService.get(key);

    return stringValue ? JSON.parse(stringValue) : undefined;
  }

  public async clearAllCache(): Promise<void> {
    const keys = await this.cacheService.keys("PATTERN:*");

    keys.forEach(async (key) => await this.cacheService.del(key));
  }
}
