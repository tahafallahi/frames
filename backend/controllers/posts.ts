import { body, matchedData, validationResult } from "express-validator";

import db from "../database/db.js";
import { ReactionAction, ReactionType, type Reaction } from "../types/reaction.js";
import { ValidationError } from "../error/AppErrors.js";

import type { Request, Response } from "express";
import type { Tag } from "../types/post.js";
import type { ShowIdentifier } from "../types/show.js";
import type { PostOrderByWithRelationInput } from "../generated/prisma/models.js";

export async function getPosts(req: Request, res: Response) {
  const { sort, page, mediaFilter, userFilter, showFilter, tagFilter } =
    req.query;
  let postsOrderBy: PostOrderByWithRelationInput = {};
  const user = req.user

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
  } as {}, user?.id);

  res.json(posts);
}

export async function getPost(req: Request<{ postId: string }>, res: Response) {
  const { postId } = req.params;
  const user = req.user
  const post = await db.getPost(user?.id, postId);

  return res.json(post);
}

export async function getComment(
  req: Request<{ postId: string, commentId: string }>,
  res: Response,
) {
  const { postId, commentId } = req.params;
  const user = req.user

  if (!postId) throw new ValidationError("PostId parameter doesn't exist");

  const comment = await db.getComment(user?.id, commentId);

  return res.send(comment);
}


export async function getComments(
  req: Request<{ postId: string }>,
  res: Response,
) {
  const { postId } = req.params;
  const user = req.user

  if (!postId) throw new ValidationError("PostId parameter must exist");

  const comments = await db.getComments(user?.id, postId);

  return res.send(comments);
}

export const createPost = [
  body("title").trim().notEmpty().isString().isLength({ max: 300 }),
  body("content").trim().isString().isLength({ max: 10000 }),
  body("showIdentifier").notEmpty(),
  body("tags").isArray(),

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
      tags,
    }: { title: string; content: string; showIdentifier: ShowIdentifier, tags: Tag[] } =
      matchedData(req);

    const show = await db.getOrCreateShow(
      showIdentifier.tmdbId,
      showIdentifier.mediaType,
    );

    const post = await db.createPost(title, content, show.id, req.user!.id, undefined, tags);

    return res.json(post);
  },
];

export const updateReaction = [
  body("type").notEmpty().isIn([ReactionType.LIKE, ReactionType.DISLIKE]),
  body("action").notEmpty().isIn([ReactionAction.ADD, ReactionAction.REMOVE]),

  async (req: Request<{ postId: string, commentId?: string }>, res: Response) => {
    if (!validationResult(req).isEmpty())
      throw new ValidationError(
        "Likes payload invalid body",
        validationResult(req).array(),
      );

    const { type, action } = matchedData(req);
    const { postId, commentId } = req.params;

    if (!commentId) {
      await db.updatePostReaction(req.user!.id, postId, { type, action });
    } else {
      await db.updateCommentReaction(req.user!.id, commentId, { type, action });
    }
    return res.status(204).end()
  },
];
