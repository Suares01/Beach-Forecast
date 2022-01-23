import { Request, Response } from "express";

import { Controller, Post } from "@overnightjs/core";
import { Beach, IBeach } from "@src/models/Beach";

import { BaseController } from ".";

@Controller("beaches")
export class BeachesController extends BaseController {
  @Post("")
  public async create(req: Request, res: Response): Promise<Response> {
    try {
      const { lat, lng, name, position } = req.body as IBeach;

      const beach = new Beach({ lat, lng, name, position });

      const result = await beach.save();

      return res.status(201).send(result);
    } catch (err: any) {
      return this.sendCreatedUpdateErrorResponse(res, err);
    }
  }
}
