import type { NextFunction, Request, Response } from "express";
import { MediaType } from "generated/prisma/enums";
import { getTrendingMoviesTmdb, getTrendingTvTmdb } from "services/tmdb-services";

export function getTrendingShows(mediaType: MediaType) {
  return async function (req: Request, res: Response, next: NextFunction) {
    const { page } = req.query;

    if (page && typeof page !== "string") {
      return res
        .status(400)
        .json({ error: "page query must be of type string" });
    }

    try {
      const shows =
        mediaType === MediaType.MOVIE
          ? await getTrendingMoviesTmdb(Number(page) || 1)
          : await getTrendingTvTmdb(Number(page) || 1);
      return res.json(shows);
    } catch (error) {
      next(error);
    }
  };
}

export async function getTrendingShowsTitle(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { page } = req.query;

  if (page && typeof page !== "string") {
    return res.status(400).json({ error: "page query must be of type string" });
  }

  try {
    const movies = (await getTrendingMoviesTmdb(Number(page) || 1)).map(
      (s) => ({ title: s.title, tmdbId: s.tmdbId }),
    );
    const tvs = (await getTrendingTvTmdb(Number(page) || 1)).map(
      (s) => ({ title: s.title, tmdbId: s.tmdbId }),
    );
    return res.json({ movies, tvs });
  } catch (error) {
    next(error);
  }
}
