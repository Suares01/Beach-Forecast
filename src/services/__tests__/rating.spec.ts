import { IBeach, Position } from "@src/models/Beach";

import { Rating } from "../Rating";

describe("Rating Service", () => {
  const defaultBeach: IBeach = {
    lat: -22.9461,
    lng: -43.1811,
    name: "Copacabana",
    position: Position.south,
    user: "fake_id",
  };

  const defaultRating = new Rating(defaultBeach);

  describe("Calculate rating for a given point", () => {
    // TODO
  });

  describe("Get rating based on wind and wave positions", () => {
    it("should get rating 1 for a beach with onshore winds", () => {
      const rating = defaultRating.ratingBasedOnWindAndWavePositions(
        Position.east,
        Position.east
      );

      expect(rating).toBe(1);
    });

    it("should return 3 for a beach with cross winds", () => {
      const rating = defaultRating.ratingBasedOnWindAndWavePositions(
        Position.south,
        Position.east
      );

      expect(rating).toBe(3);
    });

    it("should get 5 for a beach with offshore winds", () => {
      const rating = defaultRating.ratingBasedOnWindAndWavePositions(
        Position.south,
        Position.north
      );

      expect(rating).toBe(5);
    });
  });

  describe("Get rating based on swell period", () => {
    it("shold get a rating of 1 for a period of 5 seconds", () => {
      const rating = defaultRating.ratingForSwellPeriod(5);

      expect(rating).toBe(1);
    });

    it("shold get a rating of 2 for a period of 9 seconds", () => {
      const rating = defaultRating.ratingForSwellPeriod(9);

      expect(rating).toBe(2);
    });

    it("shold get a rating of 4 for a period of 12 seconds", () => {
      const rating = defaultRating.ratingForSwellPeriod(12);

      expect(rating).toBe(4);
    });

    it("shold get a rating of 5 for a period of 16 seconds", () => {
      const rating = defaultRating.ratingForSwellPeriod(16);

      expect(rating).toBe(5);
    });
  });

  // height in meters
  describe("Get rating based on swell height", () => {
    it("should get rating 1 for less than ankle to knee high swell", () => {
      const rating = defaultRating.ratingForSwellSize(0.2);

      expect(rating).toBe(1);
    });

    it("should get rating 2 for an ankle to knee high swell", () => {
      const rating = defaultRating.ratingForSwellSize(0.6);

      expect(rating).toBe(2);
    });

    it("should get rating 3 for waist high swell", () => {
      const rating = defaultRating.ratingForSwellSize(1.5);

      expect(rating).toBe(3);
    });

    it("should get rating 5 for overhead swell", () => {
      const rating = defaultRating.ratingForSwellSize(2.5);

      expect(rating).toBe(5);
    });
  });
});
