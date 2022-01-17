import { SetupServer } from '@src/Server';
import supertest from 'supertest';

let server: SetupServer;
beforeAll(async () => {
  server = new SetupServer();
  await server.initServer();
  global.testRequest = supertest(server.app);
});

afterAll(async () => await server.close());
