import { StormGlass } from "@src/clients/StormGlass";
import Cache from "@src/util/Cache";
import * as HTTPUtil from "@src/util/Request";
import stormGlassNormalizedWeatherFixtures from "@tests/fixtures/stormGlassNormalizedWeather15hoursFixtues.json";
import stormGlassWeatherFixtures from "@tests/fixtures/stormGlassWeather15hoursFixtures.json";

jest.mock("@src/util/Request");
jest.mock("@src/util/Cache");

describe("Storm Glass client", () => {
  const MockedRequestClass = HTTPUtil.Request as jest.Mocked<
    typeof HTTPUtil.Request
  >;

  const mockedRequest = new HTTPUtil.Request() as jest.Mocked<HTTPUtil.Request>;

  const MockedCache = Cache as jest.Mocked<typeof Cache>;

  const lat = -22.9461;
  const lng = -43.1811;

  it("should return the normalized forecast from the StormGlass service", async () => {
    mockedRequest.get.mockResolvedValue({
      data: stormGlassWeatherFixtures,
    } as HTTPUtil.Response);

    MockedCache.get.mockResolvedValue(undefined);

    const stormGlass = new StormGlass(mockedRequest, MockedCache);

    const response = await stormGlass.fetchPoints(lat, lng);

    expect(response).toEqual(stormGlassNormalizedWeatherFixtures);
  });

  it("should return normalized forecast from cache", async () => {
    mockedRequest.get.mockResolvedValue({
      data: null,
    } as HTTPUtil.Response);

    MockedCache.get.mockResolvedValue(stormGlassNormalizedWeatherFixtures);

    const stormGlass = new StormGlass(mockedRequest, MockedCache);

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

    MockedCache.get.mockResolvedValue(undefined);

    const stormGlass = new StormGlass(mockedRequest, MockedCache);

    const response = await stormGlass.fetchPoints(lat, lng);

    expect(response).toEqual([]);
  });

  it("should get a generic error from StormGlass service when the request fail before reaching the service", async () => {
    mockedRequest.get.mockRejectedValue({ message: "Network Error" });

    MockedCache.get.mockResolvedValue(undefined);

    const stormGlass = new StormGlass(mockedRequest, MockedCache);

    await expect(stormGlass.fetchPoints(lat, lng)).rejects.toThrow(
      "Unexpected error when trying to communicate to StormGlass: Network Error"
    );
  });

  it("should get an StormGlassResponseError when the StormGlass service responds with error", async () => {
    MockedRequestClass.isRequestError.mockReturnValue(true);

    mockedRequest.get.mockRejectedValue({
      response: {
        status: 429,
        data: { errors: ["Rate Limit reached"] },
      },
    });

    MockedCache.get.mockResolvedValue(undefined);

    const stormGlass = new StormGlass(mockedRequest, MockedCache);

    await expect(stormGlass.fetchPoints(lat, lng)).rejects.toThrow(
      'Unexpected error returned by the StormGlass service: Error: {"errors":["Rate Limit reached"]} Code: 429'
    );
  });
});
