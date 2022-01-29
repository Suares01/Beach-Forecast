import { User } from "@src/models/User";
import { AuthService } from "@src/services/Auth";

describe("Users functional tests", () => {
  beforeEach(async () => await User.deleteMany());

  const newUser = {
    name: "Jhon Doe",
    email: "jhon_doe@mail.com",
    password: "12345",
  };

  describe("When creating a new user", () => {
    it("should successfully create a new user with encrypted password", async () => {
      const { body, status } = await global.testRequest
        .post("/users")
        .send(newUser);

      const user = await User.findOne({ email: newUser.email }).exec();

      expect(status).toBe(201);

      await expect(
        AuthService.comparePassword(newUser.password, `${user?.password}`)
      ).resolves.toBeTruthy();

      expect(body).toEqual(
        expect.objectContaining({
          ...{ name: newUser.name, email: newUser.email },
          ...{ id: user?.id },
        })
      );
    });

    it("should return 422 when there is a validation error", async () => {
      const userWithinName = {
        email: "jhon_doe@mail.com",
        password: "12345",
      };

      const { body, status } = await global.testRequest
        .post("/users")
        .send(userWithinName);

      expect(status).toBe(422);
      expect(body).toEqual({
        code: 422,
        error: "Unprocessable Entity",
        message: "User validation failed: name: Path `name` is required.",
      });
    });

    it("should return 409 when the email already exists", async () => {
      await global.testRequest.post("/users").send(newUser);
      const { status, body } = await global.testRequest
        .post("/users")
        .send(newUser);

      expect(status).toBe(409);
      expect(body).toEqual({
        code: 409,
        error: "Conflict",
        message:
          "User validation failed: email: already exists in the database",
      });
    });
  });

  describe("When authenticating a user", () => {
    it("should generate a token for a valid user", async () => {
      await new User(newUser).save();

      const { body, status } = await global.testRequest
        .post("/users/authenticate")
        .send({ email: newUser.email, password: newUser.password });

      expect(status).toBe(200);

      expect(body).toEqual(
        expect.objectContaining({ token: expect.any(String) })
      );
    });

    it("should return unauthorized if the user with the given email isn't found", async () => {
      const { body, status } = await testRequest
        .post("/users/authenticate")
        .send({ email: "invalid_email", password: newUser.password });

      expect(status).toBe(401);

      expect(body).toEqual({
        code: 401,
        error: "Unauthorized",
        message: "email or password incorrect",
      });
    });

    it("should return unauthorized if the password given by the user is incorrect", async () => {
      const { body, status } = await testRequest
        .post("/users/authenticate")
        .send({ email: newUser.email, password: "invalid_password" });

      expect(status).toBe(401);

      expect(body).toEqual({
        code: 401,
        error: "Unauthorized",
        message: "email or password incorrect",
      });
    });
  });
});
