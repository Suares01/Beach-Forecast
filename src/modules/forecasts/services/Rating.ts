import { injectable } from "tsyringe";

import { IBeach, Position } from "@modules/beaches/models/mongoose/Beach";
import { IForecastPoint } from "@modules/forecasts/clients/StormGlass";

const waveHeights = {
  ankleToKnee: {
    min: 0.3,
    max: 0.9,
  },
  waistHigh: {
    min: 1.0,
    max: 1.9,
  },
  overhead: {
    min: 2.0,
    max: 2.5,
  },
};

@injectable()
export class Rating {
  constructor(private beach: IBeach) {}

  public getRateForPoint(point: IForecastPoint): number {
    const waveDirections = this.getPositionFromDirection(point.waveDirection);
    const windDirections = this.getPositionFromDirection(point.windDirection);

    const windAndWaveRate = this.ratingBasedOnWindAndWavewindPosition(
      waveDirections,
      windDirections
    );

    const swellPeriodRate = this.ratingForSwellPeriod(point.swellPeriod);

    const swellHeightRate = this.ratingForSwellHeight(point.swellHeight);

    const rating = (windAndWaveRate + swellPeriodRate + swellHeightRate) / 3;

    return Math.round(rating);
  }

  public ratingBasedOnWindAndWavewindPosition(
    wavePosition: Position,
    windPosition: Position
  ): number {
    if (wavePosition === windPosition) return 1;

    if (this.isWindOffShore(wavePosition, windPosition)) return 5;

    return 3;
  }

  public ratingForSwellPeriod(swellPeriod: number): number {
    if (swellPeriod < 7) return 1;

    if (swellPeriod < 10) return 2;

    if (swellPeriod < 14) return 4;

    return 5;
  }

  public ratingForSwellHeight(swellHeight: number): number {
    if (swellHeight < waveHeights.ankleToKnee.min) return 1;

    if (
      swellHeight >= waveHeights.ankleToKnee.min &&
      swellHeight < waveHeights.ankleToKnee.max
    )
      return 2;

    if (
      swellHeight >= waveHeights.waistHigh.min &&
      swellHeight <= waveHeights.waistHigh.max
    )
      return 3;

    return 5;
  }

  public getPositionFromDirection(coordinates: number): Position {
    if (
      (coordinates >= 315 && coordinates <= 360) ||
      (coordinates >= 0 && coordinates <= 35)
    )
      return Position.north;

    if (coordinates >= 36 && coordinates <= 125) return Position.east;

    if (coordinates >= 126 && coordinates <= 225) return Position.south;

    if (coordinates >= 226 && coordinates <= 314) return Position.west;

    return Position.north;
  }

  private isWindOffShore(
    wavePosition: Position,
    windPosition: Position
  ): boolean {
    return (
      (wavePosition === "N" &&
        windPosition === "S" &&
        this.beach.position === "N") ||
      (wavePosition === "S" &&
        windPosition === "N" &&
        this.beach.position === "S") ||
      (wavePosition === "E" &&
        windPosition === "W" &&
        this.beach.position === "E") ||
      (wavePosition === "W" &&
        windPosition === "E" &&
        this.beach.position === "W")
    );
  }
}
