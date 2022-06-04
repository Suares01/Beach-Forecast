import "reflect-metadata";

import { ICacheService } from "@services/cacheService/ICacheService";
import * as HTTPUtil from "@shared/util/Request";
import stormGlassNormalizedWeatherFixtures from "@tests/fixtures/stormGlassNormalizedWeather15hoursFixtues.json";
import stormGlassWeatherFixtures from "@tests/fixtures/stormGlassWeather15hoursFixtures.json";

import { StormGlass } from "../StormGlass";

jest.mock("@shared/util/Request");

describe("Storm Glass client", () => {
  const mockedRequest = new HTTPUtil.Request() as jest.Mocked<HTTPUtil.Request>;

  const mockedCache: jest.Mocked<ICacheService> = {
    set: jest.fn(),
    get: jest.fn(),
    clearAllCache: jest.fn(),
    connect: jest.fn(),
    disconnect: jest.fn(),
  };

  const lat = -22.9461;
  const lng = -43.1811;

  it("should return the normalized forecast from the StormGlass service", async () => {
    mockedRequest.get.mockResolvedValue({
      data: stormGlassWeatherFixtures,
    } as HTTPUtil.Response);

    mockedCache.get.mockResolvedValue(undefined);

    const stormGlass = new StormGlass(mockedCache, mockedRequest);

    const response = await stormGlass.fetchPoints(lat, lng);

    expect(response).toEqual(stormGlassNormalizedWeatherFixtures);
  });

  it("should return normalized forecast from cache", async () => {
    mockedRequest.get.mockResolvedValue({
      data: null,
    } as HTTPUtil.Response);

    mockedCache.get.mockResolvedValue(stormGlassNormalizedWeatherFixtures);

    const stormGlass = new StormGlass(mockedCache, mockedRequest);

    const response = await stormGlass.fetchPoints(lat, lng);

    expect(response).toEqual(stormGlassNormalizedWeatherFixtures);
  });

  it("should exclude incomplete data points", async () => {
    const incompleteResponse = {
      hours: [
        {
          waveHeight: {
            noaa: 300,
          },
          time: "2022-01-13T00:00:00+00:00",
        },
      ],
    };

    mockedRequest.get.mockResolvedValue({
      data: incompleteResponse,
    } as HTTPUtil.Response);

    mockedCache.get.mockResolvedValue(undefined);

    const stormGlass = new StormGlass(mockedCache, mockedRequest);

    const response = await stormGlass.fetchPoints(lat, lng);

    expect(response).toEqual([]);
  });

  it("should get a generic error from StormGlass service when the request fail before reaching the service", async () => {
    mockedRequest.get.mockRejectedValue({ message: "Network Error" });

    mockedCache.get.mockResolvedValue(undefined);

    const stormGlass = new StormGlass(mockedCache, mockedRequest);

    await expect(stormGlass.fetchPoints(lat, lng)).rejects.toThrow(
      "Unexpected error when trying to communicate to StormGlass: Network Error"
    );
  });

  it("should get an StormGlassResponseError when the StormGlass service responds with error", async () => {
    mockedRequest.isRequestError.mockReturnValue(true);
    mockedRequest.get.mockRejectedValue({
      response: {
        status: 429,
        data: { errors: ["Rate Limit reached"] },
      },
    });

    mockedCache.get.mockResolvedValue(undefined);

    const stormGlass = new StormGlass(mockedCache, mockedRequest);

    await expect(stormGlass.fetchPoints(lat, lng)).rejects.toThrow(
      'Unexpected error returned by the StormGlass service: Error: {"errors":["Rate Limit reached"]} Code: 429'
    );
  });
});
