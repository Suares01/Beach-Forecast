import Redis from "@src/services/cacheService";

export class Cache {
  constructor(protected cacheService = Redis) {}

  public async set<T = any>(key: string, value: T, ttl: number): Promise<void> {
    await this.cacheService.set(key, JSON.stringify(value), {
      EX: ttl,
    });
  }

  public async get<T = any>(key: string): Promise<T | undefined> {
    const stringValue = await this.cacheService.get(key);

    if (!stringValue) return undefined;

    const objectValue: T = JSON.parse(stringValue);

    return objectValue;
  }

  public async clearAllCache(): Promise<void> {
    await this.cacheService.flushAll();
  }
}
