export interface IStormGlassConfig {
  endpoint: string;
  apiKey: string;
  cacheTtl: number;
}

export interface IResourcesConfig {
  StormGlass: IStormGlassConfig;
}

export interface IAuth {
  secret: string;
}

export interface ICache {
  url: string;
  pass: string;
}

export interface IDatabaseConfig {
  url: string;
}

export interface ILoggerConfig {
  enabled: boolean;
  level: string;
}

export interface IConfig {
  port: number;
  database: IDatabaseConfig;
  auth: IAuth;
  cache: ICache;
  resources: IResourcesConfig;
  logger: ILoggerConfig;
}
