import { Router } from "express";

import { beachesRoutes } from "./beaches.routes";
import { forecastRoutes } from "./forecasts.routes";
import { userRoutes } from "./users.routes";

const routes = Router();

routes.use(userRoutes);
routes.use(beachesRoutes);
routes.use(forecastRoutes);

export default routes;
