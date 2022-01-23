import { Request, Response } from "express";

import { Controller, Post } from "@overnightjs/core";
import { IUser, User } from "@src/models/User";

import { BaseController } from ".";

@Controller("users")
export class UsresController extends BaseController {
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
}
