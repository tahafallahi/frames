import db from "database/db";
import { ValidationError } from "error/AppErrors";

import type { Request, Response } from "express";
import type { PostOrderByWithRelationInput } from "generated/prisma/models";

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

  const comments = await db.getComments(postId)

  return res.send(comments);
}
