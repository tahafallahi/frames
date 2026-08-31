import { prisma } from "../lib/prisma";
import type { Request, Response } from "express";

export async function getShow(req: Request<{ showId: number }>, res: Response) {
  const { showId } = req.params;

  const show = await prisma.show.findUnique({
    include: {genres: true},
    where: { id: Number(req.params.showId) },
  });

  if (!show) {
    return res.status(404).end();
  }

  return res.json(show);
}
