import NodeCache from "node-cache";

class Cache {
  constructor(protected cacheService = new NodeCache()) {}

  public async set<T>(key: string, value: T, ttl: number): Promise<boolean> {
    return this.cacheService.set<T>(key, value, ttl);
  }

  public async get<T>(key: string): Promise<T | undefined> {
    const value = this.cacheService.get<T>(key);

    if (!value) return undefined;

    return value;
  }

  public async clearAllCache(): Promise<void> {
    return this.cacheService.flushAll();
  }
}

export default new Cache();
