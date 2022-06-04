import "reflect-metadata";
import "@shared/containers";
import "express-async-errors";

import config from "config";
import cors from "cors";
import express from "express";
import expressPino from "express-pino-logger";
import { createServer } from "http";
import { serve, setup } from "swagger-ui-express";
import { container } from "tsyringe";

import { ILoggerConfig } from "@config/types/configTypes";
import * as database from "@database/mongoose";
import { ICacheService } from "@services/cacheService/ICacheService";
import logger from "@shared/logger";

import docs from "../../docs/docs.openapi.json";
import { errorHandler } from "./middlewares/errorHandler";
import { internalErrorHandler } from "./middlewares/internalErrorHandler";
import { mongooseErrorHandler } from "./middlewares/mongooseErrorHandler";
import routes from "./routes";

export class ExpressServer {
  constructor(private port = config.get<number>("App.port")) {}

  private logConfig = config.get<ILoggerConfig>("App.logger");

  private app = express();

  public http = createServer(this.app);

  private cacheService = container.resolve<ICacheService>("CacheService");

  public async initServer(): Promise<void> {
    this.setupExpress();
    await this.docsSetup();
    this.setupRoutes();
    await this.databaseSetup();
    await this.cacheServiceSetup();
    this.setupErrorHandlers();
  }

  public start(): void {
    process.send?.("ready");
    this.http.listen(this.port, () => {
      logger.info(`Server is running on port ${this.port}`);
    });
  }

  public async close(): Promise<void> {
    await this.cacheService.disconnect();
    await database.close();

    await new Promise<void>((resolve, reject) => {
      this.http.close((err) => {
        if (err) return reject(err);

        return resolve();
      });
    });
  }

  private setupExpress(): void {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
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

  private setupRoutes(): void {
    this.app.use(routes);
  }

  private async docsSetup(): Promise<void> {
    this.app.use("/docs", serve, setup(docs));
  }

  private async databaseSetup(): Promise<void> {
    await database.connect();
  }

  private async cacheServiceSetup(): Promise<void> {
    await this.cacheService.connect();
  }

  private setupErrorHandlers(): void {
    this.app.use(mongooseErrorHandler);
    this.app.use(internalErrorHandler);
    this.app.use(errorHandler);
  }
}
