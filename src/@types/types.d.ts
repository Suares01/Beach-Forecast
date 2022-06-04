/* eslint-disable @typescript-eslint/naming-convention */

declare namespace Express {
  export interface Request {
    user?: import("@services/Auth").DecodedUser;
  }
}
