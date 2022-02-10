import { Time } from "../Time";

describe("Time tests", () => {
  it("should return the next 24 hours in unix timestamp", () => {
    const now = Math.floor(Date.now() / 1000);
    const next24Hours = now + 86400;

    const time = Time.getUnixTime();

    expect(time.start).toBe(now);
    expect(time.end).toBe(next24Hours);
  });
});
