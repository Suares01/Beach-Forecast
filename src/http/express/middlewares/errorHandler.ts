import { NextFunction, Request, Response } from "express";

import { APIError } from "@shared/errors/ApiError";
import logger from "@shared/logger";

export function errorHandler(
  error: any,
  _: Request,
  res: Response,
  __: NextFunction
): Response {
  logger.error(error);
  return res.status(500).json(
    APIError.format({
      message: "Something went wrong",
      code: 500,
    })
  );
}
