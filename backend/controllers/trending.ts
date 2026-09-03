import type { NextFunction, Request, Response } from "express";
import { getTrendingMoviesTmdb, getTrendingTvTmdb } from "services/tmdb";

export async function getTrendingMovies(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { page } = req.query;

  if (page && typeof page !== "string") {
    return res.status(400).json({ error: "page query must be of type string" });
  }

  try {
    const movies = await getTrendingMoviesTmdb(Number(page) || 1);
    return res.json(movies);
  } catch (error) {
    next(error);
  }
}

export async function getTrendingTvs(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { page } = req.query;

  if (page && typeof page !== "string") {
    return res.status(400).json({ error: "page query must be of type string" });
  }

  try {
    const tvs = await getTrendingTvTmdb(Number(page) || 1);
    return res.json(tvs);
  } catch (error) {
    next(error);
  }
}
