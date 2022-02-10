import { NextFunction, Request, Response } from "express";

import { APIError } from "@src/util/errors/ApiError";

export function apiErrorValidator(
  error: any,
  _: Partial<Request>,
  res: Response,
  __: NextFunction
): Response {
  const errorCode = error.status || 500;

  return res
    .status(errorCode)
    .send(APIError.format({ code: errorCode, message: error.message }));
}
