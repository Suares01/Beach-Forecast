import supertest from "supertest";

import { ExpressServer } from "../src/http/express/Server";

let server: ExpressServer;

beforeAll(async () => {
  server = new ExpressServer();
  await server.initServer();
  server.start();
  global.testRequest = supertest(server.http);
});

afterAll(async () => await server.close());
