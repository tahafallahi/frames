import type { Request, Response } from "express";
import { MediaType } from "generated/prisma/enums";
import db from "database/db";

export function getShow(mediatype: MediaType) {
  return async function (
    req: Request<{ showId: string }>,
    res: Response,
  ) {
    const { showId } = req.params;

    res.json(await db.getShow(Number(showId), mediatype))
  };
}
