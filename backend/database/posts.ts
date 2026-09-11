import { prisma } from "lib/prisma";
import configs from "configs";
import { NotFoundError } from "error/AppErrors";

import type { PostOrderByWithRelationInput } from "generated/prisma/models";
import type { MediaType } from "generated/prisma/enums";

export async function getPost(postId: string) {
  const result = await prisma.post.findUnique({
    where: { id: postId },
    select: {
      id: true,
      title: true,
      content: true,
      picturePath: true,
      tags: { select: { name: true } },
      createdAt: true,
      author: { select: { id: true, username: true, profilePath: true } },
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

  if (!result) throw new NotFoundError(`Post with id ${postId}`);

  const { _count, ...rest } = result;
  const post = {
    ...rest,
    likesCount: _count.likes,
    commentsCount: _count.comments,
  };

  return post;
}

export async function getPosts(
  page: number,
  postsOrderBy: PostOrderByWithRelationInput,
  filters: {
    tagFilter?: string[];
    mediaFilter?: MediaType[];
    userFilter?: string[];
    showFilter?: string[];
  },
) {
  const result = await prisma.post.findMany({
    select: {
      id: true,
      title: true,
      content: true,
      picturePath: true,
      tags: { select: { name: true } },
      createdAt: true,
      author: { select: { id: true, username: true, profilePath: true } },
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

    where: {
      AND: {
        ...(filters.tagFilter && {
          tags: { some: { name: { in: filters.tagFilter } } },
        }),
        ...(filters.mediaFilter && {
          show: { mediaType: { in: filters.mediaFilter  } },
        }),
        ...(filters.userFilter && {
          authorId: { in: filters.userFilter},
        }),
        ...(filters.showFilter && {
          show: {
            tmdbId: {
              in: filters.showFilter.map((f: string) => Number(f)),
            },
          },
        }),
      },
    },
    skip: (Number(page) - 1) * configs.PAGE_LENGTH,
    take: configs.PAGE_LENGTH,
    orderBy: postsOrderBy,
  });

  const posts = result.map(({ _count, ...post }) => ({
    ...post,
    likesCount: _count.likes,
    commentsCount: _count.comments,
  }));

  return posts;
}
