import { Controller, Post } from '@overnightjs/core';
import { Beach } from '@src/models/Beach';
import { Request, Response } from 'express';

import { BaseController } from '.';

@Controller('beaches')
export class BeachesController extends BaseController {
  @Post('')
  public async create(req: Request, res: Response): Promise<Response> {
    try {
      const beach = new Beach(req.body);

      const result = await beach.save();

      return res.status(201).send(result);
    } catch (err: any) {
      return this.sendCreatedUpdateErrorResponse(res, err);
    }
  }
}
