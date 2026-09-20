import db from "database/db";
import { NotFoundError, ValidationError } from "error/AppErrors";
import type { Request, Response } from "express";
import { body, matchedData, validationResult } from "express-validator";

export const createComment = [
  body("content").notEmpty().isLength({ max: 5000 }),
  body("postId").notEmpty().isString(),
  body("parentId").notEmpty().isString(),

  async (req: Request, res: Response) => {
    if (!validationResult(req).isEmpty())
      throw new ValidationError(
        "Invalid comment structure",
        validationResult(req).array(),
      );

    const { content, postId, parentId } = matchedData(req);

    const post = await db.getPost(postId);
    if (!post) throw new NotFoundError("Post with id " + postId)

    const comment = await db.createComment({content, postId, userId: req.user!.id, parentId})

    return res.json(comment)
  },
];
