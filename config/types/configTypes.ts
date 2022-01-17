export interface IStormGlassConfig {
  apiUrl: string
  apiToken: string
}

export interface IResources {
  StormGlass: IStormGlassConfig
}

export interface IDatabase {
  mongoUrl: string
}

export interface IConfigs {
  database: IDatabase
  resources: IResources
}

export interface IAppConfig {
  App: IConfigs
}
