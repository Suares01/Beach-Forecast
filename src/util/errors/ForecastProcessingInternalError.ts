import { InternalError } from "./InternalError";

export class ForecastProcessingInternalError extends InternalError {
  constructor(message: string) {
    const internalMessage = "Unexpected error during the forecast processing";
    super(`${internalMessage}: ${message}`);
  }
}
