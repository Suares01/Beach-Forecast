import { Request, Response } from "express";

import { Controller, Get } from "@overnightjs/core";
import { Beach } from "@src/models/Beach";
import { Forecast } from "@src/services/Forecast";

@Controller("forecast")
export class ForecastController {
  @Get("")
  public async getForecastForLoggedUser(
    _: Request,
    res: Response
  ): Promise<Response> {
    try {
      const forecast = new Forecast();

      const beaches = await Beach.find({});

      const forecasts = await forecast.processForecastForBeaches(beaches);

      return res.status(200).send(forecasts);
    } catch (err) {
      return res.status(500).send({ error: "Something went wrong" });
    }
  }
}
