import type { Request, Response } from "express";

export function getUser(req: Request, res: Response) {
  if (!req.user) return res.status(401);
  return res.json(req.user)
}
