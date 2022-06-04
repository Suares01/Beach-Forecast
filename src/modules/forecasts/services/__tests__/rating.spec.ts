import "reflect-metadata";

import { IBeach, Position } from "@modules/beaches/models/mongoose/Beach";

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

  describe("Get rating based on wind and wave positions", () => {
    it("should get rating 1 for a beach with onshore winds", () => {
      const rating = defaultRating.ratingBasedOnWindAndWavewindPosition(
        Position.east,
        Position.east
      );

      expect(rating).toBe(1);
    });

    it("should return 3 for a beach with cross winds", () => {
      const rating = defaultRating.ratingBasedOnWindAndWavewindPosition(
        Position.south,
        Position.east
      );

      expect(rating).toBe(3);
    });

    it("should get 5 for a beach with offshore winds", () => {
      const rating = defaultRating.ratingBasedOnWindAndWavewindPosition(
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
      const rating = defaultRating.ratingForSwellHeight(0.2);

      expect(rating).toBe(1);
    });

    it("should get rating 2 for an ankle to knee high swell", () => {
      const rating = defaultRating.ratingForSwellHeight(0.6);

      expect(rating).toBe(2);
    });

    it("should get rating 3 for waist high swell", () => {
      const rating = defaultRating.ratingForSwellHeight(1.5);

      expect(rating).toBe(3);
    });

    it("should get rating 5 for overhead swell", () => {
      const rating = defaultRating.ratingForSwellHeight(2.5);

      expect(rating).toBe(5);
    });
  });

  describe("Get position based on points location", () => {
    it("should get the point based on a east location", () => {
      const position = defaultRating.getPositionFromDirection(92);

      expect(position).toBe(Position.east);
    });

    it("should get the point based on a north location", () => {
      const position = defaultRating.getPositionFromDirection(360);

      expect(position).toBe(Position.north);
    });

    it("should get the point based on a north location", () => {
      const position = defaultRating.getPositionFromDirection(35);

      expect(position).toBe(Position.north);
    });

    it("should get the point based on a south location", () => {
      const position = defaultRating.getPositionFromDirection(200);

      expect(position).toBe(Position.south);
    });

    it("should get the point based on a west location", () => {
      const position = defaultRating.getPositionFromDirection(300);

      expect(position).toBe(Position.west);
    });
  });

  describe("Calculate rating for a given point", () => {
    it("should get a rating of 1 for a poor point", () => {
      const poorPoint = {
        swellDirection: 156.73,
        swellHeight: 0.72,
        swellPeriod: 5,
        time: "2022-01-11T18:00:00+00:00",
        waveDirection: 153.44,
        waveHeight: 0.72,
        windDirection: 130.65,
        windSpeed: 3.0,
      };

      const rating = defaultRating.getRateForPoint(poorPoint);

      expect(rating).toBe(1);
    });

    it("should get a rating of 2 for a ok point", () => {
      const okPoint = {
        swellDirection: 156.73,
        swellHeight: 0.72,
        swellPeriod: 8.36,
        time: "2022-01-11T18:00:00+00:00",
        waveDirection: 153.44,
        waveHeight: 0.72,
        windDirection: 130.65,
        windSpeed: 3.0,
      };

      const rating = defaultRating.getRateForPoint(okPoint);

      expect(rating).toBe(2);
    });

    it("should get a rating of 3 for a point with offshore winds and a half overhead height", () => {
      const okPoint = {
        swellDirection: 100,
        swellHeight: 1,
        swellPeriod: 8.36,
        time: "2022-01-11T18:00:00+00:00",
        waveDirection: 153.44,
        waveHeight: 0.72,
        windDirection: 250,
        windSpeed: 3.0,
      };

      const rating = defaultRating.getRateForPoint(okPoint);

      expect(rating).toBe(3);
    });
  });
});
