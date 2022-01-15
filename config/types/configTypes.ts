export interface IStormGlassConfig {
  apiUrl: string
  apiToken: string
}

export interface IResources {
  resources: {
    StormGlass: IStormGlassConfig
  }
}

export interface IAppConfig {
  App: IResources
}
