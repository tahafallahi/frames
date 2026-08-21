import type { Request, Response } from "express";
import { prisma } from "lib/prisma";

export async function getTags(req: Request, res:Response) {
  const tags = await prisma.tag.findMany()

  res.json(tags)
}