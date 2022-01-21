import { CustomValidation } from '@src/models/User';
import { Response } from 'express';
import mongoose from 'mongoose';

export abstract class BaseController {
  protected sendCreatedUpdateErrorResponse(
    res: Response,
    error: unknown,
  ): Response {
    if (error instanceof mongoose.Error.ValidationError) {
      const clientErrors = this.handleClientErrors(error);

      return res.status(clientErrors.code).send(
        {
          code: clientErrors.code,
          error: clientErrors.error,
        },
      );
    }

    return res.status(500).send({ code: 500, error: 'Something went wrong!' });
  }

  private handleClientErrors(
    error: mongoose.Error.ValidationError,
  ): { code: number; error: string } {
    const duplicatedKindErrors = Object.values(error.errors).filter(
      (err) => err.name === 'ValidatorError' && err.kind === CustomValidation.duplicated,
    );

    if (duplicatedKindErrors.length) {
      return { code: 409, error: error.message };
    }

    return { code: 422, error: error.message };
  }
}
