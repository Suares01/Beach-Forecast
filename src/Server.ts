import 'dotenv/config';

import { Server } from '@overnightjs/core';
import * as database from '@src/database/database';
import bodyParser from 'body-parser';

import { BeachesController } from './controllers/BeachesController';
import { ForecastController } from './controllers/ForecastController';

export class SetupServer extends Server {
  constructor(private port = process.env.SERVER_PORT) {
    super();
  }

  public async initServer(): Promise<void> {
    this.setupExpress();
    this.setupControllers();
    await this.databaseSetup();
  }

  private setupExpress(): void {
    this.app.use(bodyParser.json());
  }

  private setupControllers(): void {
    this.addControllers([
      new ForecastController(),
      new BeachesController(),
    ]);
  }

  private async databaseSetup(): Promise<void> {
    await database.connect();
  }

  public async close(): Promise<void> {
    await database.close();
  }
}
