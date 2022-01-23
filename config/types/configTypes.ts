export interface IStormGlassConfig {
  endpoint: string;
  apiKey: string;
}

export interface IResourcesConfig {
  StormGlass: IStormGlassConfig;
}

export interface IDatabaseConfig {
  uri: string;
}

export interface IConfig {
  database: IDatabaseConfig;
  resources: IResourcesConfig;
}

export interface IAppConfig {
  App: IConfig;
}
