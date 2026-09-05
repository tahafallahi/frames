import { getMovieFromTmdb, getTvFromTmdb } from "services/tmdb";
import { prisma } from "../lib/prisma";
import type { Request, Response } from "express";
import { MediaType } from "generated/prisma/enums";

export function getShow(mediatype: MediaType) {
  return async function (
    req: Request<{ showId: string }>,
    res: Response,
  ) {
    const { showId } = req.params;

    const dbResult = await prisma.show.findFirst({
      select: {
        id: true,
        tmdbId: true,
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
      where: { AND: { tmdbId: Number(showId), mediaType: mediatype } },
    });

    if (dbResult) {
      const { _count, genres, ...rest } = dbResult;
      const show = {
        ...rest,
        genres: genres.map((g) => g.name),
        postsCount: _count.posts,
        favouritesCount: _count.users,
      };
      return res.json(show);
    }

    // If show doesn't exist in database, get's it from tmdb
    if (!dbResult) {
      const tmdbResult =
        mediatype === MediaType.MOVIE
          ? await getMovieFromTmdb(Number(showId))
          : await getTvFromTmdb(Number(showId));

      if (!tmdbResult) return res.status(404).end();

      return res.json(tmdbResult);
    }
  };
}
