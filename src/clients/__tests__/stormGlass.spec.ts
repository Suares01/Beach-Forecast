import { StormGlass } from "@src/clients/StormGlass";
import * as HTTPUtil from "@src/util/Request";
import stormGlassNormalizedWeatherFixtures from "@tests/fixtures/stormGlassNormalizedWeather15hoursFixtues.json";
import stormGlassWeatherFixtures from "@tests/fixtures/stormGlassWeather15hoursFixtures.json";

jest.mock("@src/util/Request");

describe("Storm Glass client", () => {
  const MockedRequestClass = HTTPUtil.Request as jest.Mocked<
    typeof HTTPUtil.Request
  >;

  const mockedRequest = new HTTPUtil.Request() as jest.Mocked<HTTPUtil.Request>;

  it("should return the normalized forecast from the StormGlass service", async () => {
    const lat = -22.9461;
    const lng = -43.1811;

    mockedRequest.get.mockResolvedValue({
      data: stormGlassWeatherFixtures,
    } as HTTPUtil.Response);

    const stormGlass = new StormGlass(mockedRequest);

    const response = await stormGlass.fetchPoints(lat, lng);

    expect(response).toEqual(stormGlassNormalizedWeatherFixtures);
  });

  it("should exclude incomplete data points", async () => {
    const lat = -22.9461;
    const lng = -43.1811;
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

    const stormGlass = new StormGlass(mockedRequest);

    const response = await stormGlass.fetchPoints(lat, lng);

    expect(response).toEqual([]);
  });

  it("should get a generic error from StormGlass service when the request fail before reaching the service", async () => {
    const lat = -22.9461;
    const lng = -43.1811;

    mockedRequest.get.mockRejectedValue({ message: "Network Error" });

    const stormGlass = new StormGlass(mockedRequest);

    await expect(stormGlass.fetchPoints(lat, lng)).rejects.toThrow(
      "Unexpected error when trying to communicate to StormGlass: Network Error"
    );
  });

  it("should get an StormGlassResponseError when the StormGlass service responds with error", async () => {
    const lat = -22.9461;
    const lng = -43.1811;

    MockedRequestClass.isRequestError.mockReturnValue(true);

    mockedRequest.get.mockRejectedValue({
      response: {
        status: 429,
        data: { errors: ["Rate Limit reached"] },
      },
    });

    const stormGlass = new StormGlass(mockedRequest);

    await expect(stormGlass.fetchPoints(lat, lng)).rejects.toThrow(
      'Unexpected error returned by the StormGlass service: Error: {"errors":["Rate Limit reached"]} Code: 429'
    );
  });
});
