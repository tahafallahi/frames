import db from "database/db";
import { ValidationError } from "error/AppErrors";

import type { Request, Response } from "express";
import { body, matchedData, validationResult } from "express-validator";
import { LikeType } from "generated/prisma/enums";
import type { PostOrderByWithRelationInput } from "generated/prisma/models";
import { ReactionAction, ReactionType } from "types/reaction";
import type { ShowIdentifier } from "types/show";

export async function getPosts(req: Request, res: Response) {
  const { sort, page, mediaFilter, userFilter, showFilter, tagFilter } =
    req.query;
  let postsOrderBy: PostOrderByWithRelationInput = {};

  if (sort !== "likes" && sort !== "comments" && sort !== "time") {
    return res.status(400).json({
      error: "sort parameter must be either likes, comments or time",
    });
  }

  if (typeof page !== "string") {
    return res.status(400).json({
      error: "page parameter is not optional",
    });
  }

  if (sort === "likes") {
    postsOrderBy = { likes: { _count: "desc" } };
  } else if (sort === "comments") {
    postsOrderBy = { comments: { _count: "desc" } };
  } else if (sort === "time") {
    postsOrderBy = { createdAt: "desc" };
  }

  if (tagFilter && typeof tagFilter !== "object") {
    return res.status(400).json({
      error: "tagFilter should be of type object",
    });
  }

  if (mediaFilter && typeof mediaFilter !== "object") {
    return res.status(400).json({
      error: "mediaFilter should be of type object",
    });
  }

  if (userFilter && typeof userFilter !== "object") {
    return res.status(400).json({
      error: "userFilter should be of type object",
    });
  }

  if (showFilter && typeof showFilter !== "object") {
    return res.status(400).json({
      error: "showFilter should be of type object",
    });
  }

  const posts = await db.getPosts(Number(page), postsOrderBy, {
    tagFilter,
    mediaFilter,
    userFilter,
    showFilter,
  } as {});

  res.json(posts);
}

export async function getPost(req: Request<{ postId: string }>, res: Response) {
  const { postId } = req.params;
  const post = await db.getPost(postId);

  return res.json(post);
}

export async function getComments(
  req: Request<{ postId: string }>,
  res: Response,
) {
  const { postId } = req.params;

  if (!postId) throw new ValidationError("PostId parameter must exist");

  const comments = await db.getComments(postId);

  return res.send(comments);
}

export const createPost = [
  body("title").trim().notEmpty().isString().isLength({ max: 300 }),
  body("content").trim().isString().isLength({ max: 10000 }),
  body("showIdentifier").notEmpty(),

  async (req: Request, res: Response) => {
    if (!validationResult(req).isEmpty())
      throw new ValidationError(
        "Post object payload invalid body",
        validationResult(req).array(),
      );

    const {
      title,
      content,
      showIdentifier,
    }: { title: string; content: string; showIdentifier: ShowIdentifier } =
      matchedData(req);

    const show = await db.getOrCreateShow(
      showIdentifier.tmdbId,
      showIdentifier.mediaType,
    );

    const post = await db.createPost(title, content, show.id, req.user!.id);

    return res.json(post);
  },
];

export const updateReaction = [
  body("type").notEmpty().isIn([ReactionType.LIKE, ReactionType.DISLIKE]),
  body("action").notEmpty().isIn([ReactionAction.ADD, ReactionAction.REMOVE]),

  async (req: Request<{ postId: string }>, res: Response) => {
    if (!validationResult(req).isEmpty())
      throw new ValidationError(
        "Likes payload invalid body",
        validationResult(req).array(),
      );

    const { type, action } = matchedData(req);
    const { postId } = req.params;

    await db.updatePostReaction(req.user!.id, postId, { type, action });
    return res.status(204).end()
  },
];

export async function getReaction(
  req: Request<{ postId: string }>,
  res: Response,
) {
  const { postId } = req.params;
  const result: { type?: LikeType | null } = { type: null };
  const reaction = await db.getPostReaction(req.user!.id, postId);

  if (reaction) result.type = reaction.type;

  return res.json(result);
}
