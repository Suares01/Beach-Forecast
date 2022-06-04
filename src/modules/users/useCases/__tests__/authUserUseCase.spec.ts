import "reflect-metadata";

import { IUser } from "@modules/users/models/mongoose/User";
import { IUsersRepository } from "@modules/users/repositories/IUsersRepository";
import { AuthService } from "@services/Auth";
import { UnauthorizedError } from "@shared/errors/UnauthorizedError";

import { AuthUserUseCase } from "../AuthUserUseCase";

jest.mock("@services/Auth");

describe("AuthUserUseCase", () => {
  const mockedAuthService = AuthService as jest.Mocked<typeof AuthService>;

  const usersRepository: jest.Mocked<IUsersRepository> = {
    save: jest.fn(),
    findOne: jest.fn(),
  };

  const authUserUseCase = new AuthUserUseCase(
    usersRepository,
    mockedAuthService
  );

  const defaultUser: IUser = {
    email: "test@mail.com",
    name: "Test User",
    password: "testUserPass132",
    id: "16d5sf4ds89f15ds61f5d",
  };

  it("should return a JWT Token with success", async () => {
    usersRepository.findOne.mockResolvedValue(defaultUser);
    mockedAuthService.comparePassword.mockResolvedValue(true);
    mockedAuthService.generateToken.mockReturnValue(
      "d1f56d1s5fds61fds.sd5f1s5a61df56sa1d5as.5ds1fd6a5s1"
    );

    const { email, password } = defaultUser;

    const token = await authUserUseCase.execute({ email, password });

    expect(token).toBe("d1f56d1s5fds61fds.sd5f1s5a61df56sa1d5as.5ds1fd6a5s1");
  });

  it("should throw an UnauthorizedError if the user ins't found", async () => {
    usersRepository.findOne.mockResolvedValue(null);

    const { email, password } = defaultUser;

    await expect(
      authUserUseCase.execute({ email, password })
    ).rejects.toBeInstanceOf(UnauthorizedError);
    await expect(authUserUseCase.execute({ email, password })).rejects.toThrow(
      new UnauthorizedError("email or password incorrect")
    );
  });

  it("should throw an UnauthorizedError if the provided password is invalid", async () => {
    usersRepository.findOne.mockResolvedValue(defaultUser);
    mockedAuthService.comparePassword.mockResolvedValue(false);

    const { email, password } = defaultUser;

    await expect(
      authUserUseCase.execute({ email, password })
    ).rejects.toBeInstanceOf(UnauthorizedError);
    await expect(authUserUseCase.execute({ email, password })).rejects.toThrow(
      new UnauthorizedError("email or password incorrect")
    );
  });
});
