import { InternalError } from "./InternalError";

export class ClientRequestError extends InternalError {
  constructor(err: any) {
    const internalMessage =
      "Unexpected error when trying to communicate to StormGlass";
    super(`${internalMessage}: ${err.message}`);
  }
}
