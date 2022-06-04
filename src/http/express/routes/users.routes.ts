import { Router } from "express";

import { UsersController } from "@modules/users/controllers/express/UsersController";

import { authMiddleware } from "../middlewares/auth";

const userRoutes = Router();

const expressUsersController = new UsersController();

userRoutes.post("/users", expressUsersController.create);

userRoutes.post("/users/authenticate", expressUsersController.authenticate);

userRoutes.get("/users/me", authMiddleware, expressUsersController.me);

export { userRoutes };
