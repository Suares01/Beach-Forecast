import { NextFunction, Request, Response } from "express";

import { APIError } from "@shared/errors/ApiError";
import { InternalError } from "@shared/errors/InternalError";

export function internalErrorHandler(
  error: unknown,
  _: Request,
  res: Response,
  next: NextFunction
): Response | void {
  if (error instanceof InternalError) {
    const { code, message, description, documentation } = error;

    return res.status(code).json(
      APIError.format({
        code,
        message,
        description,
        documentation,
      })
    );
  }

  return next(error);
}
