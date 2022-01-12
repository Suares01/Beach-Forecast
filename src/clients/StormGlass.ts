import { AxiosStatic } from 'axios';

export interface IStormGlassSource {
  [key: string]: number
}

export interface IStormGlassPoint {
  time: string
  readonly swellDirection: IStormGlassSource
  readonly swellHeight: IStormGlassSource
  readonly swellPeriod: IStormGlassSource
  readonly waveDirection: IStormGlassSource
  readonly waveHeight: IStormGlassSource
  readonly windDirection: IStormGlassSource
  readonly windSpeed: IStormGlassSource
}

export interface IStormGlassForecastResponse {
  hours: IStormGlassPoint[]
}

export interface IForecastPoint {
  time: string
  swellDirection: number
  swellHeight: number
  swellPeriod: number
  waveDirection: number
  waveHeight: number
  windDirection: number
  windSpeed: number
}

export class StormGlass {
  constructor(protected request: AxiosStatic) { }

  readonly stormGlassAPIParams = 'swellDirection,swellHeight,swellPeriod,waveDirection,waveHeight,windDirection,windSpeed';

  readonly stormGlassAPISource = 'noaa';

  public async fetchPoints(lat: number, lng: number): Promise<IForecastPoint[]> {
    const response = await this.request.get<IStormGlassForecastResponse>(
      `/weather/point?params=${this.stormGlassAPIParams}&lat=${lat}&lng=${lng}&source=${this.stormGlassAPISource}&start=1641924000&end=1641924000`,
      {
        baseURL: 'https://api.stormglass.io/v2',
        headers: {
          Authorization: `${process.env.API_KEY}`,
        },
      },
    );

    const { data } = response;

    const normalizedData = this.normalizeResponse(data);

    return normalizedData;
  }

  private normalizeResponse(points: IStormGlassForecastResponse): IForecastPoint[] {
    return points.hours
      .filter(this.isValidPoint.bind(this))
      .map((point) => ({
        swellDirection: point.swellDirection[this.stormGlassAPISource],
        swellHeight: point.swellHeight[this.stormGlassAPISource],
        swellPeriod: point.swellPeriod[this.stormGlassAPISource],
        time: point.time,
        waveDirection: point.waveDirection[this.stormGlassAPISource],
        waveHeight: point.waveHeight[this.stormGlassAPISource],
        windDirection: point.windDirection[this.stormGlassAPISource],
        windSpeed: point.windSpeed[this.stormGlassAPISource],
      }));
  }

  private isValidPoint(point: Partial<IStormGlassPoint>): boolean {
    return !!(
      point.time
      && point.swellDirection?.[this.stormGlassAPISource]
      && point.swellHeight?.[this.stormGlassAPISource]
      && point.swellPeriod?.[this.stormGlassAPISource]
      && point.waveDirection?.[this.stormGlassAPISource]
      && point.waveHeight?.[this.stormGlassAPISource]
      && point.windDirection?.[this.stormGlassAPISource]
      && point.windSpeed?.[this.stormGlassAPISource]
    );
  }
}
