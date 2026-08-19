import type { Request, Response } from "express";
import { prisma } from "lib/prisma";
import configs from "../configs";
import type { PostOrderByWithRelationInput } from "generated/prisma/models";

export async function getPosts(req: Request, res: Response) {
  const { sort, page } = req.query;
  let postsOrderBy: PostOrderByWithRelationInput = {};

  if (typeof sort !== "string") {
    return res.status(400).json({
      error: "sort parameter is not optional",
    });
  }

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
    postsOrderBy = { createdAt:  "desc" };
  }

  const posts = (
    await prisma.post.findMany({
      select: {
        title: true,
        content: true,
        picturePath: true,
        tags: { select: { name: true } },
        createdAt: true,
        author: { select: { username: true, profilePath: true } },
        show: { select: { title: true, releaseYear: true, mediaType: true } },
        _count: { select: { likes: true, comments: true } },
      },
      skip: Number(page) * configs.PAGE_LENGTH,
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
