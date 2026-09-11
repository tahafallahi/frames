import type { Request, Response } from "express";
import { body, matchedData, validationResult } from "express-validator";
import { MediaType } from "generated/prisma/enums";
import { prisma } from "lib/prisma";
import { isAxiosError } from "node_modules/axios/index.cjs";
import { getMovieFromTmdb, getTvFromTmdb } from "services/tmdb-services";

export function getLoggedInUser(req: Request, res: Response) {
  if (!req.user) return res.status(401).end();
  return res.json(req.user);
}

export async function getUser(req: Request<{ userId: string }>, res: Response) {
  const { userId } = req.params;

  if (!userId)
    return res.json({ error: "userId url parameter was not provied" });

  const result = await prisma.user.findUnique({
    select: {
      id: true,
      username: true,
      email: true,
      profilePath: true,
      bio: true,
      createdAt: true,
      updatedAt: true,
      favorites: true,
      following: true,
      _count: {
        select: {
          followers: true,
          following: true,
          likes: true,
          posts: true,
        },
      },
    },
    where: { id: userId },
  });

  if (!result) return res.json({});

  const { _count, ...rest } = result;

  const user: Express.User = {
    ...rest,
    followingsCount: _count.following,
    follwersCount: _count.followers,
    likesCount: _count.likes,
    postsCount: _count.posts,
  };

  return res.json(user);
}

export const favoriteValidators = [
  body("showId")
    .notEmpty()
    .withMessage("showId must can not be empty.")
    .bail()
    .isInt()
    .withMessage("showId must be of type integer."),
  body("mediaType")
    .notEmpty()
    .withMessage("mediaType can not be empty.")
    .bail()
    .isString()
    .withMessage("mediaType must be of type string.")
    .bail()
    .isIn(Object.values(MediaType))
    .withMessage("mediaType must be either MOVIE or TV_SHOW."),
];

export async function addFavorite(req: Request, res: Response) {
  if (!validationResult(req).isEmpty()) {
    res.send(400).json({ error: validationResult(req) });
  }

  const { showId, mediaType } = matchedData(req);

  try {
    const show =
      mediaType === MediaType.MOVIE
        ? await getMovieFromTmdb(showId)
        : await getTvFromTmdb(showId);
    
  } catch (error) {
    if (isAxiosError(error)) {
      if (error.status === 404) {
        res.status(404).json({error: "showId is not a valid tmdb id."})
      }
    }
  }
}
