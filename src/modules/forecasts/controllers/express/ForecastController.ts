import { Request, Response } from "express";
import { container } from "tsyringe";

import { IBeachesRepository } from "@modules/beaches/repositories/IBeachesRepository";
import { ProcessForecastsUseCase } from "@modules/forecasts/useCases/ProcessForecastsUseCase";

export class ForecastController {
  public async getForecastForLoggedUser(
    req: Request,
    res: Response
  ): Promise<Response> {
    const forecast = container.resolve(ProcessForecastsUseCase);
    const beachesRepository =
      container.resolve<IBeachesRepository>("BeachesRepository");

    const beaches = await beachesRepository.find({
      userId: req.user?.id,
    });

    const forecasts = await forecast.processForecastForBeaches(beaches);

    return res.status(200).send(forecasts);
  }
}
