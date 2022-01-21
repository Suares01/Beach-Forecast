import { User } from '@src/models/User';

describe('Users functional tests', () => {
  beforeEach(async () => await User.deleteMany());

  describe('When creating a new user', () => {
    const newUser = {
      name: 'Jhon Doe',
      email: 'jhon_doe@mail.com',
      password: '12345',
    };

    it('should successfully create a new user', async () => {
      const { body, status } = await global.testRequest.post('/users').send(newUser);

      expect(status).toBe(201);
      expect(body).toEqual(expect.objectContaining(newUser));
    });

    it('should return 422 when there is a validation error', async () => {
      const userWithinName = {
        email: 'jhon_doe@mail.com',
        password: '12345',
      };

      const { body, status } = await global.testRequest.post('/users').send(userWithinName);

      expect(status).toBe(422);
      expect(body).toEqual(
        {
          code: 422,
          error: 'User validation failed: name: Path `name` is required.',
        },
      );
    });

    it('should return 409 when the email already exists', async () => {
      await global.testRequest.post('/users').send(newUser);
      const { status, body } = await global.testRequest.post('/users').send(newUser);

      expect(status).toBe(409);
      expect(body).toEqual(
        {
          code: 409,
          error: 'User validation failed: email: already exists in the database',
        },
      );
    });
  });
});
