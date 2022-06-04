import "reflect-metadata";

import { IUser } from "@modules/users/models/mongoose/User";
import { IUsersRepository } from "@modules/users/repositories/IUsersRepository";

import { CreateUserUseCase } from "../CreateUserUseCase";

describe("CreateUserUseCase", () => {
  const usersRepository: jest.Mocked<IUsersRepository> = {
    save: jest.fn(),
    findOne: jest.fn(),
  };

  const createUserUseCase = new CreateUserUseCase(usersRepository);

  const defaultUser: IUser = {
    email: "test@mail.com",
    name: "Test User",
    password: "testUserPass132",
    id: "16d5sf4ds89f15ds61f5d",
  };

  it("should return a user with success", async () => {
    usersRepository.save.mockResolvedValue(defaultUser);

    const { email, name, password, id } = defaultUser;

    const user = await createUserUseCase.execute({ email, name, password });

    expect(user).toEqual({
      email,
      name,
      id,
    });
  });
});
