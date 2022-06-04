import { User } from "@modules/users/models/mongoose/User";
import { AuthService } from "@services/Auth";

describe("Users integration-tests", () => {
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
          user: {
            ...{ name: newUser.name, email: newUser.email },
            ...{ id: user?.id },
          },
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

  describe("When getting user profile info", () => {
    it("should return the token's owner profile information", async () => {
      const user = await new User(newUser).save();

      const token = AuthService.generateToken(user.toJSON());

      const { body, status } = await global.testRequest
        .get("/users/me")
        .set({ "x-access-token": token });

      expect(status).toBe(200);
      expect(body).toMatchObject(
        JSON.parse(
          JSON.stringify({
            user: { id: user.id, name: user.name, email: user.email },
          })
        )
      );
    });

    it("should return Not Found when the user is not found", async () => {
      const user = new User(newUser);

      const token = AuthService.generateToken(user.toJSON());

      const { body, status } = await global.testRequest
        .get("/users/me")
        .set({ "x-access-token": token });

      expect(status).toBe(404);
      expect(body.message).toBe("user not found");
    });
  });
});
