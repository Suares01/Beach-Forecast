import { Controller, Post } from '@overnightjs/core';
import { User } from '@src/models/User';
import { Request, Response } from 'express';

import { BaseController } from '.';

@Controller('users')
export class UsresController extends BaseController {
  @Post('')
  async create(req: Request, res: Response): Promise<Response> {
    try {
      const user = new User(req.body);

      const newUser = await user.save();

      return res.status(201).send(newUser);
    } catch (err) {
      return this.sendCreatedUpdateErrorResponse(res, err);
    }
  }
}
