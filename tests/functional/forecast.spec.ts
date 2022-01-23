import nock from "nock";

import { Beach, BeachPosition } from "@src/models/Beach";
import apiForecastResponse from "@tests/fixtures/apiForecastResponse.json";
import stormGlassWeather15hoursFixtures from "@tests/fixtures/stormGlassWeather15hoursFixtures.json";

describe("Beach forecast functional tests", () => {
  beforeEach(async () => {
    await Beach.deleteMany();

    const defaultBeach = {
      lat: -22.9461,
      lng: -43.1811,
      name: "Copacabana",
      position: BeachPosition.east,
    };

    const beach = new Beach(defaultBeach);

    await beach.save();
  });

  const nockInterceptor = nock("https://api.stormglass.io", {
    encodedQueryParams: true,
    reqheaders: {
      Authorization: (): boolean => true,
    },
  })
    .get("/v2/weather/point")
    .query({
      lat: -22.9461,
      lng: -43.1811,
      params:
        "swellDirection,swellHeight,swellPeriod,waveDirection,waveHeight,windDirection,windSpeed",
      source: "noaa",
      start: 1641924000,
      end: 1641924000,
    });

  it("should return a forecast with just a few times", async () => {
    nockInterceptor.reply(200, stormGlassWeather15hoursFixtures);

    const { body, status } = await global.testRequest.get("/forecast");

    expect(status).toBe(200);
    expect(body).toEqual(apiForecastResponse);
  });

  it("should return 500 if something goes wrong during the processing", async () => {
    nockInterceptor.replyWithError("Something went wrong");

    const { status } = await global.testRequest.get("/forecast");

    expect(status).toBe(500);
  });
});
