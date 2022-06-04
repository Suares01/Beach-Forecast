import { Router } from "express";

import { BeachesController } from "@modules/beaches/controllers/express/BeachesController";

import { authMiddleware } from "../middlewares/auth";

const beachesRoutes = Router();

const expressBeachesController = new BeachesController();

beachesRoutes.use(authMiddleware);

beachesRoutes.post("/beaches", expressBeachesController.create);

export { beachesRoutes };
