import { getMovieFromTmdb, getTvFromTmdb } from "services/tmdb";
import { prisma } from "../lib/prisma";
import type { Request, Response } from "express";
import { MediaType } from "generated/prisma/enums";

export async function getMovie(
  req: Request<{ movieId: string }>,
  res: Response,
) {
  const { movieId } = req.params;

  const dbResult = await prisma.show.findFirst({
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
    where: { AND: { tmdbId: Number(movieId), mediaType: MediaType.MOVIE } },
  });

  if (dbResult) {
    const { _count, genres, ...rest } = dbResult;
    const movie = {
      ...rest,
      genres: genres.map((g) => g.name),
      postsCount: _count.posts,
      favouritesCount: _count.users,
    };
    return res.json(movie);
  }

  // If movie doesn't exist in database, get's it from tmdb
  if (!dbResult) {

    const tmdbResult = await getMovieFromTmdb(Number(movieId));

    if (!tmdbResult) return res.status(404).end();

    return res.json(tmdbResult);
  }
}

export async function getTv(
  req: Request<{ tvId: string }>,
  res: Response,
) {
  const { tvId } = req.params;

  const dbResult = await prisma.show.findFirst({
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
    where: { AND: { tmdbId: Number(tvId), mediaType: MediaType.TV_SHOW } },
  });


  if (dbResult) {
    const { _count, genres, ...rest } = dbResult;
    const tv = {
      ...rest,
      genres: genres.map((g) => g.name),
      postsCount: _count.posts,
      favouritesCount: _count.users,
    };
    return res.json(tv);
  }

  // If tv doesn't exist in database, get's it from tmdb
  if (!dbResult) {
    const tmdbResult = await  getTvFromTmdb(Number(tvId));

    if (!tmdbResult) return res.status(404).end();

    return res.json(tmdbResult);
  }
}