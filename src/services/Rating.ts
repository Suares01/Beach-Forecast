import { IBeach, Position } from "@src/models/Beach";

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

export class Rating {
  constructor(private beach: IBeach) {}

  public ratingBasedOnWindAndWavePositions(
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

  public ratingForSwellSize(swellSize: number): number {
    if (swellSize < waveHeights.ankleToKnee.min) return 1;

    if (
      swellSize >= waveHeights.ankleToKnee.min &&
      swellSize < waveHeights.ankleToKnee.max
    )
      return 2;

    if (
      swellSize >= waveHeights.waistHigh.min &&
      swellSize <= waveHeights.waistHigh.max
    )
      return 3;

    return 5;
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
