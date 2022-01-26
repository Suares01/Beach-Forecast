import { SetupServer } from "./Server";

const server = new SetupServer();

(async (): Promise<void> => {
  await server.initServer();
  server.start();
})();

process.once("SIGINT", async () => {
  await server.close();
  //  process.exit(0);
});
