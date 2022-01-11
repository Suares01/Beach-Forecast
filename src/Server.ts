import { Server } from '@overnightjs/core';
import bodyParser from 'body-parser';

import { ForecastController } from './controllers/ForecastController';

export class SetupServer extends Server {
  constructor(private port = process.env.SERVER_PORT) {
    super();
  }

  public initServer(): void {
    this.setupExpress();
    this.setupControllers();
  }

  private setupExpress(): void {
    this.app.use(bodyParser.json());
  }

  private setupControllers(): void {
    const forecastController = new ForecastController();

    this.addControllers([
      forecastController,
    ]);
  }
}
