import "reflect-metadata";

import nock from "nock";
import { container } from "tsyringe";

import { Beach, Position } from "@modules/beaches/models/mongoose/Beach";
import { User } from "@modules/users/models/mongoose/User";
import { AuthService } from "@services/Auth";
import { ICacheService } from "@services/cacheService/ICacheService";
import { Time } from "@shared/util/Time";
import apiForecastResponse from "@tests/fixtures/apiForecastResponse.json";
import stormGlassWeather15hoursFixtures from "@tests/fixtures/stormGlassWeather15hoursFixtures.json";

// NOCK IS NOT INTERCEPTING REQUESTS WITH AXIOS
describe.skip("Forecast integration-tests", () => {
  let token: string;

  beforeAll(async () => {
    await Beach.deleteMany();
    await User.deleteMany();
    await container.resolve<ICacheService>("CacheService").clearAllCache();

    const defaultBeach = {
      lat: -22.9461,
      lng: -43.1811,
      name: "Copacabana",
      position: Position.east,
    };

    const defaultUser = {
      name: "Jhon Doe",
      email: "jhon_doe@mail.com",
      password: "12345",
    };

    const user = await new User(defaultUser).save();

    token = AuthService.generateToken(user.toJSON());

    await new Beach({
      ...defaultBeach,
      ...{ user: user.id },
    }).save();
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
      start: Time.getUnixTime().start,
      end: Time.getUnixTime().end,
    });

  it("should return a forecast with just a few times", async () => {
    nockInterceptor.reply(200, stormGlassWeather15hoursFixtures);

    const { body, status } = await global.testRequest
      .get("/forecast")
      .set({ "x-access-token": token });

    expect(status).toBe(200);
    expect(body).toEqual(apiForecastResponse);
  });

  it("should return 500 if something goes wrong during the processing", async () => {
    nockInterceptor.replyWithError("Something went wrong");

    const { status, body } = await global.testRequest
      .get("/forecast")
      .set({ "x-access-token": token });

    expect(status).toBe(500);
    expect(body).toEqual({
      code: 500,
      error: "Internal Server Error",
      message:
        "Unexpected error during the forecast processing: Unexpected error when trying to communicate to StormGlass: Something went wrong",
    });
  });
});
