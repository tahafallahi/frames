import type { Request, Response } from "express";

import { searchPost, searchUser } from "services/db-search";
import { searchMovie, searchTV } from "services/tmdb";

export async function getSearchResult(req: Request, res: Response) {
  const { query, limit = 3 } = req.query;

  if (typeof query !== "string") {
    res.status(400).json({
      error: "query parameter must exist and be a single string value",
    });
    return;
  }

  const [users, posts, movies, tvs] = await Promise.all([
    searchUser(query, Number(limit)),
    searchPost(query, Number(limit)),
    searchMovie(query, Number(limit)),
    searchTV(query, Number(limit)),
  ]);

  res.json({ users, posts, movies, tvs });
}
