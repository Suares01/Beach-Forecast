import { InternalError } from "./InternalError";

export class StormGlassRequestError extends InternalError {
  constructor(err: any) {
    const internalMessage =
      "Unexpected error returned by the StormGlass service";
    super(
      `${internalMessage}: Error: ${JSON.stringify(err.response?.data)} Code: ${
        err.response?.status
      }`
    );
  }
}
