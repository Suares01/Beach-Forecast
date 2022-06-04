import { Request, Response, NextFunction } from "express";

import { AuthService } from "@services/Auth";
import { APIError } from "@shared/errors/ApiError";

export function authMiddleware(
  req: Partial<Request>,
  res: Partial<Response>,
  next: NextFunction
): Response | void {
  const token = req.headers?.["x-access-token"];

  if (!token || typeof token !== "string")
    return res.status?.(401).json(
      APIError.format({
        message: "jwt must be provided",
        code: 401,
      })
    );

  try {
    const user = AuthService.decodeToken(token);

    req.user = user;

    return next();
  } catch (error: any) {
    return res.status?.(401).json(
      APIError.format({
        message: error.message,
        code: 401,
      })
    );
  }
}
