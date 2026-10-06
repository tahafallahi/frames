import type { Request, Response } from "express";
import { body, matchedData, validationResult } from "express-validator";
import { MediaType } from "generated/prisma/enums";
import { prisma } from "lib/prisma";
import { ValidationError } from "error/AppErrors";
import db from "database/db";

export function getLoggedInUser(req: Request, res: Response) {
  return res.json(req.user);
}

export async function getUser(req: Request<{ userId: string }>, res: Response) {
  const { userId } = req.params;

  if (!userId) throw new ValidationError("UserId must exist");

  return res.json(await db.getUser(userId));
}

export const addFavorite = [
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

  async (req: Request, res: Response) => {
    if (!validationResult(req).isEmpty()) {
      throw new ValidationError(
        "Validation failed",
        validationResult(req).array(),
      );
    }

    const { showId, mediaType } = matchedData(req);

    const show = await db.getOrCreateShow(showId, mediaType);

    await prisma.user.update({
      where: { id: req.user!.id },
      data: { favorites: { connect: { id: show.id } } },
    });

    res.status(204).end();
  },
];

export const removeFavorite = [
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

  async (req: Request, res: Response) => {
    if (!validationResult(req).isEmpty()) {
      throw new ValidationError(
        "Validation failed",
        validationResult(req).array(),
      );
    }

    const { showId, mediaType } = matchedData(req);

    const show = await db.getShow(showId, mediaType);

    await prisma.user.update({
      where: { id: req.user!.id },
      data: { favorites: { disconnect: { id: show.id } } },
    });

    res.status(204).end();
  },
];

export async function followUser(
  req: Request<{ followeeUserId: string }>,
  res: Response,
) {
  const user = req.user;
  const { followeeUserId } = req.params;

  const result = await db.followUser(user!.id, followeeUserId);

  return res.status(204).end();
}

export async function unfollowUser(
  req: Request<{ followeeUserId: string }>,
  res: Response,
) {
  const user = req.user;
  const { followeeUserId } = req.params;

  const result = await db.unfollowUser(user!.id, followeeUserId);

  return res.status(204).end();
}

export async function getNewFollows(req: Request, res: Response) {
  const user = req.user;

  const reuslt = await db.getNewFollows(user!.id);

  const newFollows = await Promise.all(
    reuslt.map(async (f) => {
      const user = await db.getUser(f.followerId);
      return { username: user.username, id: user.id };
    }),
  );

  return res.json(newFollows);
}

export async function dismissEveryFollow(req: Request, res: Response) {
  const user = req.user;

  await db.dismissEveryFollow(user!.id);

  return res.status(204).end();
}

export async function getFollowings(req: Request, res: Response) {
  const user = req.user;

  const users = await db.getFollowings(user!.id);

  return res.json(users);
}

export const editProfile = [
  body("bio").trim().notEmpty().isLength({ max: 1000 }),
  async (req: Request, res: Response) => {
    const user = req.user
    if (!validationResult(req).isEmpty())
      throw new ValidationError(
        "Profile edit validation failed",
        validationResult(req).array(),
      );
    const { bio } = matchedData(req);
    const updatedUser = await db.editProfile(user!.id, bio)

    return res.json(updatedUser)
  },
];
