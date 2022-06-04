import { Beach } from "@modules/beaches/models/mongoose/Beach";
import { User } from "@modules/users/models/mongoose/User";
import { AuthService } from "@services/Auth";

describe("Beaches integration-tests", () => {
  let token: string;

  beforeAll(async () => {
    await Beach.deleteMany();
    await User.deleteMany();

    const defaultUser = {
      name: "Jhon Doe",
      email: "jhon_doe@mail.com",
      password: "12345",
    };

    const user = await new User(defaultUser).save();

    token = AuthService.generateToken(user.toJSON());
  });

  const newBeach = {
    lat: -22.9461,
    lng: -43.1811,
    name: "Copacabana",
    position: "E",
  };

  describe("When creating a beach", () => {
    it("should create a beach with success", async () => {
      const response = await testRequest
        .post("/beaches")
        .set({ "x-access-token": token })
        .send(newBeach);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(expect.objectContaining(newBeach));
    });

    it("should return 422 when there is a validation error", async () => {
      const invalidBeach = {
        lng: -43.1811,
        name: "Copacabana",
        position: "E",
      };

      const response = await testRequest
        .post("/beaches")
        .set({ "x-access-token": token })
        .send(invalidBeach);

      expect(response.status).toBe(422);
      expect(response.body).toEqual({
        code: 422,
        error: "Unprocessable Entity",
        message: "Beach validation failed: lat: Path `lat` is required.",
      });
    });
  });
});
