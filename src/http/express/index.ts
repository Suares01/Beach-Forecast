import logger from "@shared/logger";

import { ExpressServer } from "./Server";

export enum ExitStatus {
  Failure = 1,
  Success = 0,
}

const server = new ExpressServer();

const exitSignals: NodeJS.Signals[] = ["SIGINT", "SIGTERM", "SIGQUIT"];

process.on("unhandledRejection", (reason, promise) => {
  logger.error(
    `App exiting due to an unhandled promsie: ${promise} ans reason: ${reason}`
  );

  throw reason;
});

process.on("uncaughtException", (error) => {
  logger.error(`App exiting due to an uncaught exception: ${error}`);

  process.exit(ExitStatus.Failure);
});

(async (): Promise<void> => {
  try {
    await server.initServer();
    server.start();

    exitSignals.forEach((signal) =>
      process.on(signal, async () => {
        try {
          await server.close();
          logger.info("App exited with success");
          process.exit(ExitStatus.Success);
        } catch (error) {
          logger.error(`App exited with error: ${error}`);
          process.exit(ExitStatus.Failure);
        }
      })
    );
  } catch (error) {
    logger.error(`App exited with error: ${error}`);
    process.exit(ExitStatus.Failure);
  }
})();
