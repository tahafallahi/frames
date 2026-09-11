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