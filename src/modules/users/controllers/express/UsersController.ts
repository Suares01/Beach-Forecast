import { Request, Response } from "express";
import { container } from "tsyringe";

import { IUser } from "@modules/users/models/mongoose/User";
import { AuthUserUseCase } from "@modules/users/useCases/AuthUserUseCase";
import { CreateUserUseCase } from "@modules/users/useCases/CreateUserUseCase";
import { GetUserDataUseCase } from "@modules/users/useCases/GetUserDataUseCase";

export class UsersController {
  async create(req: Request, res: Response): Promise<Response> {
    const { name, email, password } = req.body as IUser;

    const user = await container
      .resolve(CreateUserUseCase)
      .execute({ email, name, password });

    return res.status(201).json({ user });
  }

  async authenticate(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body as IUser;

    const token = await container
      .resolve(AuthUserUseCase)
      .execute({ email, password });

    return res.status(200).json({ token });
  }

  public async me(req: Request, res: Response): Promise<Response> {
    const email = req.user?.email;

    const user = await container.resolve(GetUserDataUseCase).execute({ email });

    return res.json({
      user,
    });
  }
}
