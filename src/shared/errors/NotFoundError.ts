import { InternalError } from "./InternalError";

export class NotFoundError extends InternalError {
  constructor(
    public message: string,
    public code = 404,
    public description?: string,
    public documentation?: string
  ) {
    super(message, code, description, documentation);
  }
}
