import { Controller, Get } from '@overnightjs/core';
import { Request, Response } from 'express';

@Controller('forecast')
export class ForecastController {
  @Get('')
  public getForecastForLoggedUser(_: Request, res: Response): void {
    res.send([
      {
        time: '2022-01-11T18:00:00+00:00',
        forecast: [
          {
            lat: -22.9461,
            lng: -43.1811,
            name: 'Copacabana',
            position: 'E',
            rating: 1,
            swellDirection: 156.73,
            swellHeight: 0.72,
            swellPeriod: 8.36,
            time: '2022-01-11T18:00:00+00:00',
            waveDirection: 153.44,
            waveHeight: 0.72,
            windDirection: 130.65,
            windSpeed: 3.0,
          },
        ],
      },
    ]);
  }
}
