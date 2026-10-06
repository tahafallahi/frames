import type { Request, Response } from "express";
import { MediaType } from "generated/prisma/enums.js";
import db from "database/db.js";

export function getShow(mediatype: MediaType) {
  return async function (
    req: Request<{ showId: string }>,
    res: Response,
  ) {
    const { showId } = req.params;

    res.json(await db.getShow(Number(showId), mediatype))
  };
}
