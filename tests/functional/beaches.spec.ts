import { Beach } from '@src/models/Beach';

describe('Beaches functional tests', () => {
  beforeAll(async () => await Beach.deleteMany({}));

  const newBeach = {
    lat: -22.9461,
    lng: -43.1811,
    name: 'Copacabana',
    position: 'E',
  };

  describe('When creating a beach', () => {
    it('should create a beach with success', async () => {
      const response = await global.testRequest.post('/beaches').send(newBeach);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(expect.objectContaining(newBeach));
    });

    it('should return 422 when there is a validation error', async () => {
      const invalidBeach = {
        lat: 'invalidString',
        lng: -43.1811,
        name: 'Copacabana',
        position: 'E',
      };

      const response = await global.testRequest.post('/beaches').send(invalidBeach);

      expect(response.status).toBe(422);
      expect(response.body).toEqual(
        {
          code: 422,
          error:
        'Beach validation failed: lat: Cast to Number failed for value "invalidString" (type string) at path "lat"',
        },
      );
    });
  });
});
