import bodyParser from "body-parser";
import config from "config";

import { Server } from "@overnightjs/core";
import * as database from "@src/database/database";

import { BeachesController } from "./controllers/BeachesController";
import { ForecastController } from "./controllers/ForecastController";
import { UsresController } from "./controllers/UsersController";
import logger from "./log/logger";

export class SetupServer extends Server {
  constructor(private port = config.get<number>("App.port")) {
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
      new UsresController(),
    ]);
  }

  private async databaseSetup(): Promise<void> {
    await database.connect();
  }

  public start(): void {
    process.send?.("ready");
    this.app.listen(this.port, () => {
      logger.info(`Server is running on port ${this.port}`);
    });
  }

  public async close(): Promise<void> {
    await database.close();
  }
}
