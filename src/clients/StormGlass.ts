import { AxiosStatic } from 'axios';

export class StormGlass {
  constructor(protected request: AxiosStatic) {}

  readonly stormGlassAPIParams = 'swellDirection,swellHeight,swellPeriod,waveDirection,waveHeight,windDirection,windSpeed';

  readonly stormGlassAPISource = 'noaa';

  public async fetchPoints(lat: number, lng: number): Promise<unknown> {
    return this.request.get(
      `/weather/point?params=${this.stormGlassAPIParams}&lat=${lat}&lng=${lng}&source=${this.stormGlassAPISource}&start=1641924000&end=1641924000`,
      {
        baseURL: 'https://api.stormglass.io/v2',
      },
    );
  }
}
