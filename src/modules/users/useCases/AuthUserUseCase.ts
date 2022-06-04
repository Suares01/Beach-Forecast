import { inject, injectable } from "tsyringe";

import { AuthService } from "@services/Auth";
import { UnauthorizedError } from "@shared/errors/UnauthorizedError";

import { SaveUserData } from "../dtos";
import { IUsersRepository } from "../repositories/IUsersRepository";

type AuthUser = Omit<SaveUserData, "name">;

@injectable()
export class AuthUserUseCase {
  constructor(
    @inject("UsersRepository") private usersRepository: IUsersRepository,
    @inject("AuthService") private authService: typeof AuthService
  ) {}

  public async execute({ email, password }: AuthUser): Promise<string> {
    const user = await this.usersRepository.findOne({ email });

    if (!user) throw new UnauthorizedError("email or password incorrect");

    const verifyPassword = await this.authService.comparePassword(
      password,
      user.password
    );

    if (!verifyPassword)
      throw new UnauthorizedError("email or password incorrect");

    const token = this.authService.generateToken({
      id: user.id,
      name: user.name,
      email: user.email,
    });

    return token;
  }
}
