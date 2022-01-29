import bodyParser from "body-parser";
import config from "config";
import cors from "cors";
import expressPino from "express-pino-logger";
import * as http from "http";

import { ILoggerConfig } from "@config/types/configTypes";
import { Server } from "@overnightjs/core";
import * as database from "@src/database/database";

import { BeachesController } from "./controllers/BeachesController";
import { ForecastController } from "./controllers/ForecastController";
import { UsresController } from "./controllers/UsersController";
import logger from "./log/logger";

export class SetupServer extends Server {
  private server?: http.Server;

  private logConfig = config.get<ILoggerConfig>("App.logger");

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
    this.app.use(
      expressPino({
        enabled: this.logConfig.enabled,
        level: this.logConfig.level,
      })
    );
    this.app.use(
      cors({
        origin: "*",
      })
    );
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

    if (this.server) {
      await new Promise((resolve, reject) => {
        this.server?.close((err) => {
          if (err) return reject(err);

          return resolve(true);
        });
      });
    }
  }
}
