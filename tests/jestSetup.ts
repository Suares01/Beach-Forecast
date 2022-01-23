import supertest from "supertest";

import { SetupServer } from "@src/Server";

let server: SetupServer;
beforeAll(async () => {
  server = new SetupServer();
  await server.initServer();
  global.testRequest = supertest(server.app);
});

afterAll(async () => await server.close());
