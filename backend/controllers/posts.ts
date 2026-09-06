import { prisma } from "lib/prisma";
import configs from "../configs";

import { buildCommentTree } from "services/comment-tree";

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

  const posts = (
    await prisma.post.findMany({
      select: {
        id: true,
        title: true,
        content: true,
        picturePath: true,
        tags: { select: { name: true } },
        createdAt: true,
        author: { select: { username: true, profilePath: true } },
        show: { select: { title: true, releaseYear: true, mediaType: true } },
        _count: { select: { likes: true, comments: true } },
      },
      where: {
        AND: {
          ...(tagFilter && {
            tags: { some: { name: { in: tagFilter as string[] } } },
          }),
          ...(mediaFilter && {
            show: { mediaType: { in: mediaFilter as string[] } },
          }),
          ...(userFilter && { authorId: { in: userFilter as string[] } }),
          ...(showFilter && {
            show: {tmdbId: {
              in: showFilter.map((f: string) => Number(f)),
            },}
          }),
        },
      },
      skip: (Number(page) - 1) * configs.PAGE_LENGTH,
      take: configs.PAGE_LENGTH,
      orderBy: postsOrderBy,
    })
  ).map(({ _count, ...post }) => ({
    ...post,
    likesCount: _count.likes,
    commentsCount: _count.comments,
  }));

  res.json(posts);
}

export async function getPost(req: Request<{ postId: string }>, res: Response) {
  const { postId } = req.params;

  const result = await prisma.post.findUnique({
    where: { id: postId },
    select: {
      id: true,
      title: true,
      content: true,
      picturePath: true,
      tags: { select: { name: true } },
      createdAt: true,
      author: { select: { username: true, profilePath: true } },
      show: {
        select: {
          tmdbId: true,
          title: true,
          releaseYear: true,
          mediaType: true,
        },
      },
      _count: { select: { likes: true, comments: true } },
    },
  });

  if (!result) {
    return res.status(404).end();
  }

  const { _count, ...rest } = result;
  const post = {
    ...rest,
    likesCount: _count.likes,
    commentsCount: _count.comments,
  };

  return res.json(post);
}

export async function getComments(
  req: Request<{ postId: string }>,
  res: Response,
) {
  const { postId } = req.params;

  if (!postId) {
    return res
      .status(400)
      .json({ error: "there was no postId parameter in the url" });
  }

  const result = await prisma.comment.findMany({
    select: {
      id: true,
      content: true,
      author: { select: { username: true, profilePath: true } },
      parentId: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          replies: true,
          likes: true,
        },
      },
    },
    where: { postId: postId },
  });

  if (!result) {
    return res.status(404).end();
  }

  const comments = result.map(({ _count, ...rest }) => ({
    ...rest,
    repliesCount: _count.replies,
    likesCount: _count.likes,
  }));

  const commentsWithReplies = buildCommentTree(comments);

  return res.json(commentsWithReplies);
}
