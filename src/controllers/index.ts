import { Response } from "express";
import mongoose from "mongoose";

import logger from "@src/log/logger";
import { CustomValidation } from "@src/models/User";
import { APIError } from "@src/util/errors/ApiError";
import { IAPIError } from "@src/util/errors/interfaces/ErrorInterfaces";

export abstract class BaseController {
  protected sendCreatedUpdateErrorResponse(
    res: Response,
    error: unknown
  ): Response {
    if (error instanceof mongoose.Error.ValidationError) {
      const clientErrors = this.handleClientErrors(error);

      return res.status(clientErrors.code).send(
        APIError.format({
          code: clientErrors.code,
          message: clientErrors.error,
        })
      );
    }

    logger.error(error);
    return res
      .status(500)
      .send(APIError.format({ code: 500, message: "Something went wrong!" }));
  }

  private handleClientErrors(error: mongoose.Error.ValidationError): {
    code: number;
    error: string;
  } {
    const duplicatedKindErrors = Object.values(error.errors).filter(
      (err) =>
        err.name === "ValidatorError" &&
        err.kind === CustomValidation.duplicated
    );

    if (duplicatedKindErrors.length) {
      return { code: 409, error: error.message };
    }

    return { code: 422, error: error.message };
  }

  protected sendErrorResponse(res: Response, error: IAPIError): Response {
    return res.status(error.code).send(APIError.format(error));
  }
}
