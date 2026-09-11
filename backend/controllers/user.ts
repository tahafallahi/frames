import type { Request, Response } from "express";
import { body, matchedData, validationResult } from "express-validator";
import { MediaType } from "generated/prisma/enums";
import { prisma } from "lib/prisma";
import { isAxiosError } from "axios";
import { getMovieFromTmdb, getTvFromTmdb } from "services/tmdb-services";
import { ValidationError } from "error/AppErrors";
import db from "database/db";

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
    throw new ValidationError(
      "Validation failed",
      validationResult(req).array(),
    );
  }

  const { showId, mediaType } = matchedData(req);

  const show = await db.getOrCreateShow(showId, mediaType);

  return await prisma.user.update({
    where: { id: req.user?.id },
    data: { favorites: { connect: { id: show.id } } },
  });
}
