import { Request, Response } from "express";

import { Controller, Get, Middleware, Post } from "@overnightjs/core";
import { authMiddleware } from "@src/middlewares/auth";
import { IUser, User } from "@src/models/User";
import { AuthService } from "@src/services/Auth";
import { APIError } from "@src/util/errors/ApiError";

import { BaseController } from ".";

@Controller("users")
export class UsersController extends BaseController {
  @Post("")
  async create(req: Request, res: Response): Promise<Response> {
    try {
      const { name, email, password } = req.body as IUser;

      const user = new User({ name, email, password });

      const { id, name: savedName, email: savedEmail } = await user.save();

      return res.status(201).send({ id, name: savedName, email: savedEmail });
    } catch (err) {
      return this.sendCreatedUpdateErrorResponse(res, err);
    }
  }

  @Post("authenticate")
  async login(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body as IUser;

    const user = await User.findOne({ email });

    if (!user)
      return res.status(401).send(
        APIError.format({
          code: 401,
          message: "email or password incorrect",
        })
      );

    const verifyPassword = await AuthService.comparePassword(
      password,
      user.password
    );

    if (!verifyPassword)
      return res.status(401).send(
        APIError.format({
          code: 401,
          message: "email or password incorrect",
        })
      );

    const token = AuthService.generateToken({
      id: user.id,
      name: user.name,
      email: user.email,
    });

    return res.status(200).send({ token });
  }

  @Get("me")
  @Middleware(authMiddleware)
  public async me(req: Request, res: Response): Promise<Response> {
    const email = req.user?.email;

    const user = await User.findOne({ email });

    if (!user)
      return this.sendErrorResponse(res, {
        code: 404,
        message: "User not found",
      });

    return res.send(
      JSON.parse(
        JSON.stringify({
          user: { id: user.id, name: user.name, email: user.email },
        })
      )
    );
  }
}
