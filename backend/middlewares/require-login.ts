import { UnauthorizedError } from "error/AppErrors";
import type { NextFunction, Request, Response } from "express";

export function requireLogin(req: Request, res: Response, next: NextFunction) {
  if (!req.user) throw new UnauthorizedError();

  return next()
}
