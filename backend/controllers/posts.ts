import type { Request, Response } from "express";
import { prisma } from "lib/prisma";
import configs from "../configs";
import type { PostOrderByWithRelationInput } from "generated/prisma/models";
import { MediaType } from "generated/prisma/enums";

export async function getPosts(req: Request, res: Response) {
  const { sort, page, mediaFilter, tagFilter } = req.query;
  let tagFilterArray: string[];
  let mediaFilterArray: MediaType[];
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

  if (typeof tagFilter !== "string") {
    return res.status(400).json({
      error: "tagFilter should be a string",
    });
  }

  if (tagFilter) {
    tagFilterArray = tagFilter.split(",");
  } else {
    tagFilterArray = (await prisma.tag.findMany()).map((t) => t.name);
  }

  if (typeof mediaFilter !== "string") {
    return res.status(400).json({
      error: "mediaFilter should be a string",
    });
  }

  if (mediaFilter) {
    mediaFilterArray = mediaFilter.split(",").map((f) => {
      if (f == "movie") {
        return MediaType.MOVIE;
      } else {
        return MediaType.TV_SHOW;
      }
    });
    console.log(mediaFilterArray);
  } else {
    mediaFilterArray = [MediaType.MOVIE, MediaType.TV_SHOW];
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
          tags: { some: { name: { in: tagFilterArray } } },
          show: { mediaType: { in: mediaFilterArray } },
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
  const result = await prisma.post.findUnique({
    where: { id: req.params.postId },
    select: {
      id: true,
      title: true,
      content: true,
      picturePath: true,
      tags: { select: { name: true } },
      createdAt: true,
      author: { select: { username: true, profilePath: true } },
      show: { select: { id: true, title: true, releaseYear: true, mediaType: true } },
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

  return res.json(post)
}
