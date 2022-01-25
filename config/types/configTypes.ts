export interface IStormGlassConfig {
  endpoint: string;
  apiKey: string;
}

export interface IResourcesConfig {
  StormGlass: IStormGlassConfig;
}

export interface IAuth {
  secret: string;
}

export interface IDatabaseConfig {
  uri: string;
}

export interface IConfig {
  database: IDatabaseConfig;
  auth: IAuth;
  resources: IResourcesConfig;
}

export interface IAppConfig {
  App: IConfig;
}
