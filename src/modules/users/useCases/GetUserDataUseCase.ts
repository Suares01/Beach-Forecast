import { inject, injectable } from "tsyringe";

import { FindUserData } from "@modules/users/dtos";
import { NotFoundError } from "@shared/errors/NotFoundError";

import { IUser } from "../models/mongoose/User";
import { IUsersRepository } from "../repositories/IUsersRepository";

@injectable()
export class GetUserDataUseCase {
  constructor(
    @inject("UsersRepository") private usersRepository: IUsersRepository
  ) {}

  public async execute({
    email,
  }: FindUserData): Promise<Omit<IUser, "password">> {
    const user = await this.usersRepository.findOne({ email });

    if (!user) throw new NotFoundError("user not found");

    return { email: user.email, name: user.name, id: user.id };
  }
}
