import { Router } from "express";

import { ForecastController } from "@modules/forecasts/controllers/express/ForecastController";

import { authMiddleware } from "../middlewares/auth";
import { rateLimiter } from "../middlewares/rateLimiter";

const forecastRoutes = Router();

const forecastController = new ForecastController();

forecastRoutes.get(
  "/forecast",
  rateLimiter("Too many requests to the /forecast endpoint"),
  authMiddleware,
  forecastController.getForecastForLoggedUser
);

export { forecastRoutes };
