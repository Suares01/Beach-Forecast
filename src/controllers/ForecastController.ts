import { Request, Response } from "express";

import {
  ClassMiddleware,
  Controller,
  Get,
  Middleware,
} from "@overnightjs/core";
import { authMiddleware } from "@src/middlewares/auth";
import { rateLimiter } from "@src/middlewares/rateLimiter";
import { Beach } from "@src/models/Beach";
import { Forecast } from "@src/services/Forecast";

import { BaseController } from ".";

@Controller("forecast")
@ClassMiddleware(authMiddleware)
export class ForecastController extends BaseController {
  @Get("")
  @Middleware(rateLimiter("Too many requests to the /forecast endpoint"))
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
    } catch (err: any) {
      return this.sendErrorResponse(res, {
        code: 500,
        message: "Something went wrong",
      });
    }
  }
}
