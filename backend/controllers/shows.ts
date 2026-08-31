import { prisma } from "../lib/prisma";
import type { Request, Response } from "express";

export async function getShow(req: Request<{ showId: number }>, res: Response) {
  const { showId } = req.params;

  const result = await prisma.show.findUnique({
    select: {
      id: true,
      title: true,
      overview: true,
      mediaType: true,
      posterPath: true,
      releaseYear: true,
      genres: { select: { name: true } },
      _count: {
        select: {
          posts: true,
          users: true,
        },
      },
    },
    where: { id: Number(req.params.showId) },
  });

  if (!result) {
    return res.status(404).end();
  }

  const { _count, genres, ...rest } = result;
  const show = {
    ...rest,
    genres: genres.map((g) => g.name),
    postsCount: _count.posts,
    favouritesCount: _count.users,
  };

  return res.json(show);
}
