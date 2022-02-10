import { Request, Response, NextFunction } from "express";

import { AuthService } from "@src/services/Auth";
import { APIError } from "@src/util/errors/ApiError";

export function authMiddleware(
  req: Partial<Request>,
  res: Partial<Response>,
  next: NextFunction
): void {
  const token = req.headers?.["x-access-token"];

  if (!token || typeof token !== "string") {
    res.status?.(401).send(
      APIError.format({
        message: "jwt must be provided",
        code: 401,
      })
    );

    return;
  }

  try {
    const user = AuthService.decodeToken(token);

    req.user = user;

    next();
  } catch (error: any) {
    res.status?.(401).send(
      APIError.format({
        message: error.message,
        code: 401,
      })
    );
  }
}
