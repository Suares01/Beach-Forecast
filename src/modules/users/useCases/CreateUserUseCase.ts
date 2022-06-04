import { inject, injectable } from "tsyringe";

import { SaveUserData } from "../dtos";
import { IUser } from "../models/mongoose/User";
import { IUsersRepository } from "../repositories/IUsersRepository";

@injectable()
export class CreateUserUseCase {
  constructor(
    @inject("UsersRepository") private usersRepository: IUsersRepository
  ) {}

  public async execute(data: SaveUserData): Promise<Omit<IUser, "password">> {
    const { email, name, id } = await this.usersRepository.save(data);

    return { email, name, id };
  }
}
