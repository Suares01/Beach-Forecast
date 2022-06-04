import { Request, Response } from "express";
import { container } from "tsyringe";

import { SaveBeachData } from "@modules/beaches/dtos";
import { CreateBeachUseCase } from "@modules/beaches/useCases/CreateBeachUseCase";

export class BeachesController {
  public async create(req: Request, res: Response): Promise<Response> {
    const beachInfo = req.body as SaveBeachData;
    const user = req.user?.id as string;

    const beach = await container
      .resolve(CreateBeachUseCase)
      .execute({ ...beachInfo, user });

    return res.status(201).json(beach);
  }
}
