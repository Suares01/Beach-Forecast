import { Request, Response } from "express";
import rateLimit, { RateLimitRequestHandler } from "express-rate-limit";

import { APIError } from "@src/util/errors/ApiError";

export function rateLimiter(message: string): RateLimitRequestHandler {
  return rateLimit({
    windowMs: 3600000, // 1 hour
    max: 2,
    keyGenerator(req: Request): string {
      return req.ip;
    },
    handler(_, res: Response): Response {
      return res.status(429).send(
        APIError.format({
          message,
          code: 429,
        })
      );
    },
  });
}