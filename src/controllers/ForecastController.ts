import { Request, Response } from "express";

import { ClassMiddleware, Controller, Get } from "@overnightjs/core";
import { authMiddleware } from "@src/middlewares/auth";
import { Beach } from "@src/models/Beach";
import { Forecast } from "@src/services/Forecast";

@Controller("forecast")
@ClassMiddleware(authMiddleware)
export class ForecastController {
  @Get("")
  public async getForecastForLoggedUser(
    req: Request,
    res: Response
  ): Promise<Response> {
    try {
      const forecast = new Forecast();

      const beaches = await Beach.find({
        user: req.user?.id,
      });

      const forecasts = await forecast.processForecastForBeaches(beaches);

      return res.status(200).send(forecasts);
    } catch (err) {
      return res.status(500).send({ error: "Something went wrong" });
    }
  }
}
