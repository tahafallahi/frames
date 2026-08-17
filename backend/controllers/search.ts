import type { Request, Response } from "express";

import axios from "axios";
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

  if (typeof limit !== "number") {
    res.status(400).json({ error: "limit parameter must be a nuber" });
    return;
  }

  const [usersResult, postsResult, moviesResult, tvsResult] =
    await Promise.allSettled([
      searchUser(query, limit),
      searchPost(query, limit),
      searchMovie(query, limit),
      searchTV(query, limit),
    ]);

  res.json({
    users:
      usersResult.status === "fulfilled"
        ? usersResult.value
        : { error: true, data: [] },
    posts:
      postsResult.status === "fulfilled"
        ? postsResult.value
        : { error: true, data: [] },
    movies:
      moviesResult.status === "fulfilled"
        ? moviesResult.value
        : { error: true, data: [] },
    tvs:
      tvsResult.status === "fulfilled"
        ? tvsResult.value
        : { error: true, data: [] },
  });
}
