import { InternalError } from "./InternalError";

export class UnauthorizedError extends InternalError {
  constructor(
    public message: string,
    public code = 401,
    public description?: string,
    public documentation?: string
  ) {
    super(message, code, description, documentation);
  }
}
