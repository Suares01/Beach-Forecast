import { StormGlass } from "@src/clients/StormGlass";
import { Position, IBeach } from "@src/models/Beach";
import { ForecastProcessingInternalError } from "@src/util/errors/ForecastProcessingInternalError";
import stormGlassNormalizedResponseFixture from "@tests/fixtures/stormGlassNormalizedWeather15hoursFixtues.json";

import { Forecast, ITimeForecast } from "../Forecast";

jest.mock("@src/clients/StormGlass");

describe("Forecast Service", () => {
  const mockedStormGlass = new StormGlass() as jest.Mocked<StormGlass>;

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

    const forecast = new Forecast(mockedStormGlass);
    const beachesWithRating = await forecast.processForecastForBeaches(beaches);

    expect(beachesWithRating).toEqual(expectedResponse);
  });

  it("should return an empty list when the beaches array is empty", async () => {
    const forecast = new Forecast();
    const response = await forecast.processForecastForBeaches([]);

    expect(response).toEqual([]);
  });

  it("should throw internal processing error when something goes wrong during the rating process", async () => {
    mockedStormGlass.fetchPoints.mockRejectedValue({
      message: "Error fetching data",
    });

    const forecast = new Forecast(mockedStormGlass);

    await expect(forecast.processForecastForBeaches(beaches)).rejects.toThrow(
      ForecastProcessingInternalError
    );
  });

  it("should return the forecast for multiple beaches in the same hour with different ratings", async () => {
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
        ],
      },
    ];

    const forecast = new Forecast(mockedStormGlass);

    const beachesWithRating = await forecast.processForecastForBeaches(beaches);

    expect(beachesWithRating).toEqual(expectedResponse);
  });
});
