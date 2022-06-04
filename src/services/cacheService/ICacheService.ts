export interface ICacheService {
  connect(): Promise<void>;

  disconnect(): Promise<void>;

  set<T = any>(key: string, value: T, ttl: number): Promise<void>;

  get<T = any>(key: string): Promise<T | undefined>;

  clearAllCache(): Promise<void>;
}
