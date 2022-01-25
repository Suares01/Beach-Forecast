import { Request, Response, NextFunction } from "express";

import { AuthService } from "@src/services/Auth";

export function authMiddleware(
  req: Partial<Request>,
  res: Partial<Response>,
  next: NextFunction
): void {
  const token = req.headers?.["x-access-token"];

  if (!token || typeof token !== "string") {
    res.status?.(401).send({
      code: 401,
      error: "jwt must be provided",
    });

    return;
  }

  try {
    const user = AuthService.decodeToken(token);

    req.user = user;

    next();
  } catch (error: any) {
    res.status?.(401).send({
      code: 401,
      error: error.message,
    });
  }
}
