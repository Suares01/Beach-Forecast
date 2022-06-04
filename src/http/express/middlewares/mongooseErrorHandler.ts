import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";

import { CustomValidation } from "@modules/users/models/mongoose/User";
import { APIError } from "@shared/errors/ApiError";
import logger from "@shared/logger";

type ValidationError = {
  code: number;
  message: string;
};

function handleMongooseValidationError(
  error: mongoose.Error.ValidationError
): ValidationError {
  const duplicatedError = Object.values(error.errors).filter(
    (err) =>
      err.name === "ValidatorError" && err.kind === CustomValidation.duplicated
  );

  const requiredError = Object.values(error.errors).filter(
    (err) =>
      err.name === "ValidatorError" && err.kind === CustomValidation.required
  );

  if (duplicatedError.length) return { code: 409, message: error.message };

  if (requiredError.length) return { code: 422, message: error.message };

  logger.error(error);
  return { code: 400, message: "Validation error" };
}

export function mongooseErrorHandler(
  error: unknown,
  _: Request,
  res: Response,
  next: NextFunction
): Response | void {
  if (error instanceof mongoose.Error.ValidationError) {
    const { code, message } = handleMongooseValidationError(error);

    return res.status(code).json(
      APIError.format({
        code,
        message,
      })
    );
  }

  return next(error);
}
