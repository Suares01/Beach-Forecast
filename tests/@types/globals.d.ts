/* eslint-disable vars-on-top */
/* eslint-disable no-var */
import { SuperTest, Test } from 'supertest';

declare global {
    var testRequest: SuperTest<Test>;
}
