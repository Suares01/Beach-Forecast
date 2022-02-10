import nock from "nock";

import { Beach, Position } from "@src/models/Beach";
import { User } from "@src/models/User";
import { AuthService } from "@src/services/Auth";
import apiForecastResponse from "@tests/fixtures/apiForecastResponse.json";
import stormGlassWeather15hoursFixtures from "@tests/fixtures/stormGlassWeather15hoursFixtures.json";

describe("Beach forecast functional tests", () => {
  let token: string;

  beforeEach(async () => {
    await Beach.deleteMany();
    await User.deleteMany({});

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

    const beach = new Beach({ ...defaultBeach, ...{ user: user.id } });

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
      params: /(.*)/,
      source: "noaa",
      start: /(.*)/,
      end: /(.*)/,
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
      message: "Something went wrong",
    });
  });
});
