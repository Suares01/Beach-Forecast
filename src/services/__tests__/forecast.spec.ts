import { StormGlass } from "@src/clients/StormGlass";
import { BeachPosition, IBeach } from "@src/models/Beach";
import { ForecastProcessingInternalError } from "@src/util/errors/ForecastProcessingInternalError";
import stormGlassNormalizedResponseFixture from "@tests/fixtures/stormGlassNormalizedWeather15hoursFixtues.json";

import { Forecast } from "../Forecast";

jest.mock("@src/clients/StormGlass");

describe("Forecast Service", () => {
  const mockedStormGlass = new StormGlass() as jest.Mocked<StormGlass>;

  const beaches: IBeach[] = [
    {
      lat: -22.9461,
      lng: -43.1811,
      name: "Copacabana",
      position: BeachPosition.east,
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
            rating: 1,
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
});
