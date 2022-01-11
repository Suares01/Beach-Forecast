import { SetupServer } from '@src/Server';
import supertest from 'supertest';

beforeAll(() => {
  const server = new SetupServer();
  server.initServer();
  global.testRequest = supertest(server.app);
});
