import { Request, Response } from "express";

import { ClassMiddleware, Controller, Post } from "@overnightjs/core";
import { authMiddleware } from "@src/middlewares/auth";
import { Beach, IBeach } from "@src/models/Beach";

import { BaseController } from ".";

@Controller("beaches")
@ClassMiddleware(authMiddleware)
export class BeachesController extends BaseController {
  @Post("")
  public async create(req: Request, res: Response): Promise<Response> {
    try {
      const beachInfo = req.body as IBeach;

      const beach = new Beach({ ...beachInfo, ...{ user: req.user?.id } });

      const result = await beach.save();

      return res.status(201).send(result);
    } catch (err: any) {
      return this.sendCreatedUpdateErrorResponse(res, err);
    }
  }
}
