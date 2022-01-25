/* eslint-disable @typescript-eslint/naming-convention */

declare namespace Express {
  export interface Request {
    user?: import("@src/services/Auth").IDecodedUser;
  }
}
