import "reflect-metadata";

import { IBeach, Position } from "@modules/beaches/models/mongoose/Beach";
import { StormGlass } from "@modules/forecasts/clients/StormGlass";
import { Rating } from "@modules/forecasts/services/Rating";
import { ICacheService } from "@services/cacheService/ICacheService";
import { ForecastProcessingInternalError } from "@shared/errors/ForecastProcessingInternalError";
import stormGlassNormalizedResponseFixture from "@tests/fixtures/stormGlassNormalizedWeather15hoursFixtues.json";

import {
  ProcessForecastsUseCase,
  ITimeForecast,
} from "../ProcessForecastsUseCase";

jest.mock("@modules/forecasts/clients/StormGlass");

describe("Forecast Service", () => {
  const mockedCache: jest.Mocked<ICacheService> = {
    set: jest.fn(),
    get: jest.fn(),
    clearAllCache: jest.fn(),
    connect: jest.fn(),
    disconnect: jest.fn(),
  };

  const mockedStormGlass = new StormGlass(
    mockedCache
  ) as jest.Mocked<StormGlass>;

  const beaches: IBeach[] = [
    {
      lat: -22.9461,
      lng: -43.1811,
      name: "Copacabana",
      position: Position.east,
      user: "fake_id",
    },
  ];

  it("should return the forecast for a list of beaches", async () => {
    mockedStormGlass.fetchPoints.mockResolvedValue(
      stormGlassNormalizedResponseFixture
    );

    const expectedResponse = [
      {
        time: "2022-01-11T18:00:00+00:00",
        forecast: [
          {
            lat: -22.9461,
            lng: -43.1811,
            name: "Copacabana",
            position: "E",
            rating: 2,
            swellDirection: 156.73,
            swellHeight: 0.72,
            swellPeriod: 8.36,
            time: "2022-01-11T18:00:00+00:00",
            waveDirection: 153.44,
            waveHeight: 0.72,
            windDirection: 130.65,
            windSpeed: 3.0,
          },
        ],
      },
    ];

    const forecast = new ProcessForecastsUseCase(mockedStormGlass, Rating);
    const beachesWithRating = await forecast.processForecastForBeaches(beaches);

    expect(beachesWithRating).toEqual(expectedResponse);
  });

  it("should return an empty list when the beaches array is empty", async () => {
    const forecast = new ProcessForecastsUseCase(mockedStormGlass, Rating);
    const response = await forecast.processForecastForBeaches([]);

    expect(response).toEqual([]);
  });

  it("should throw internal processing error when something goes wrong during the rating process", async () => {
    mockedStormGlass.fetchPoints.mockRejectedValue({
      message: "Error fetching data",
    });

    const forecast = new ProcessForecastsUseCase(mockedStormGlass, Rating);

    await expect(forecast.processForecastForBeaches(beaches)).rejects.toThrow(
      ForecastProcessingInternalError
    );
  });

  it("should return the forecast for multiple beaches in the same hour with different ratings ordered by rating", async () => {
    mockedStormGlass.fetchPoints.mockResolvedValueOnce([
      {
        swellDirection: 123.41,
        swellHeight: 0.72,
        swellPeriod: 13.67,
        time: "2022-01-11T18:00:00+00:00",
        waveDirection: 232.12,
        waveHeight: 0.72,
        windDirection: 310.65,
        windSpeed: 100,
      },
    ]);

    mockedStormGlass.fetchPoints.mockResolvedValueOnce([
      {
        swellDirection: 0,
        swellHeight: 2.0,
        swellPeriod: 13.67,
        time: "2022-01-11T18:00:00+00:00",
        waveDirection: 270,
        waveHeight: 2.07,
        windDirection: 299.45,
        windSpeed: 100,
      },
    ]);

    const beaches: IBeach[] = [
      {
        lat: -22.9461,
        lng: -43.1811,
        name: "Copacabana",
        position: Position.east,
        user: "fake-id",
      },
      {
        lat: -22.9461,
        lng: -43.1811,
        name: "Copacabana",
        position: Position.north,
        user: "fake-id",
      },
    ];

    const expectedResponse: ITimeForecast[] = [
      {
        time: "2022-01-11T18:00:00+00:00",
        forecast: [
          {
            lat: -22.9461,
            lng: -43.1811,
            name: "Copacabana",
            position: Position.north,
            rating: 3,
            swellDirection: 0,
            swellHeight: 2.0,
            swellPeriod: 13.67,
            time: "2022-01-11T18:00:00+00:00",
            waveDirection: 270,
            waveHeight: 2.07,
            windDirection: 299.45,
            windSpeed: 100,
          },
          {
            lat: -22.9461,
            lng: -43.1811,
            name: "Copacabana",
            position: Position.east,
            rating: 2,
            swellDirection: 123.41,
            swellHeight: 0.72,
            swellPeriod: 13.67,
            time: "2022-01-11T18:00:00+00:00",
            waveDirection: 232.12,
            waveHeight: 0.72,
            windDirection: 310.65,
            windSpeed: 100,
          },
        ],
      },
    ];

    const forecast = new ProcessForecastsUseCase(mockedStormGlass, Rating);

    const beachesWithRating = await forecast.processForecastForBeaches(beaches);

    expect(beachesWithRating).toEqual(expectedResponse);
  });
});
