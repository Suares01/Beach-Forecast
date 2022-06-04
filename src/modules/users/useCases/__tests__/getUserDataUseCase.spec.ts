import "reflect-metadata";

import { IUser } from "@modules/users/models/mongoose/User";
import { IUsersRepository } from "@modules/users/repositories/IUsersRepository";
import { NotFoundError } from "@shared/errors/NotFoundError";

import { GetUserDataUseCase } from "../GetUserDataUseCase";

describe("GetUserDataUseCase", () => {
  const usersRepository: jest.Mocked<IUsersRepository> = {
    save: jest.fn(),
    findOne: jest.fn(),
  };

  const getUserDataUseCase = new GetUserDataUseCase(usersRepository);

  const defaultUser: IUser = {
    email: "test@mail.com",
    name: "Test User",
    password: "testUserPass132",
    id: "16d5sf4ds89f15ds61f5d",
  };

  it("should return a user with success", async () => {
    usersRepository.findOne.mockResolvedValue(defaultUser);

    const { email, name, id } = defaultUser;

    const user = await getUserDataUseCase.execute({ email });

    expect(user).toEqual({ email, name, id });
  });

  it("should throw a NotFound error if the user doesn't exists", async () => {
    usersRepository.findOne.mockResolvedValue(null);

    const { email } = defaultUser;

    await expect(getUserDataUseCase.execute({ email })).rejects.toBeInstanceOf(
      NotFoundError
    );
    await expect(getUserDataUseCase.execute({ email })).rejects.toThrow(
      new NotFoundError("user not found")
    );
  });
});
