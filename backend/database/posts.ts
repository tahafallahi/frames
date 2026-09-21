import { prisma } from "lib/prisma";
import configs from "configs";
import { NotFoundError } from "error/AppErrors";

import type { PostOrderByWithRelationInput } from "generated/prisma/models";
import type { MediaType } from "generated/prisma/enums";
import type { ShowIdentifier } from "types/show";
import type { Show, Tag, User } from "generated/prisma/client";
import { ReactionType } from "types/reaction";

export async function getPost(postId: string) {
  const [result, likesCount, dislikesCount] = await prisma.$transaction([
    prisma.post.findUnique({
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
        _count: { select: { comments: true } },
      },
    }),
    prisma.like.count({ where: { postId, type: ReactionType.LIKE } }),
    prisma.like.count({ where: { postId, type: ReactionType.DISLIKE } }),
  ]);

  if (!result) throw new NotFoundError(`Post with id ${postId}`);

  const { _count, ...rest } = result;
  const post = {
    ...rest,
    likesCount: likesCount - dislikesCount,
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
  const where = {
    AND: {
      ...(filters.tagFilter && {
        tags: { some: { name: { in: filters.tagFilter } } },
      }),
      ...(filters.mediaFilter && {
        show: { mediaType: { in: filters.mediaFilter } },
      }),
      ...(filters.userFilter && {
        authorId: { in: filters.userFilter },
      }),
      ...(filters.showFilter && {
        show: {
          tmdbId: { in: filters.showFilter.map((f: string) => Number(f)) },
        },
      }),
    },
  };

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
      _count: { select: { comments: true } }, // drop likes from here too
    },
    where,
    skip: (Number(page) - 1) * configs.PAGE_LENGTH,
    take: configs.PAGE_LENGTH,
    orderBy: postsOrderBy,
  });

  const postIds = result.map((p) => p.id);

  const reactionCounts = await prisma.like.groupBy({
    by: ["postId", "type"],
    where: { postId: { in: postIds } },
    _count: true,
  });

  const countsByPost = new Map<string, { likes: number; dislikes: number }>();
  for (const rc of reactionCounts) {
    const entry = countsByPost.get(rc.postId!) ?? { likes: 0, dislikes: 0 };
    if (rc.type === ReactionType.LIKE) entry.likes = rc._count;
    if (rc.type === ReactionType.DISLIKE) entry.dislikes = rc._count;
    countsByPost.set(rc.postId!, entry);
  }

  const posts = result.map(({ _count, ...post }) => {
    const counts = countsByPost.get(post.id) ?? { likes: 0, dislikes: 0 };
    return {
      ...post,
      likesCount: counts.likes - counts.dislikes,
      commentsCount: _count.comments,
    };
  });

  return posts;
}

export async function createPost(
  title: string,
  content: string,
  showId: string,
  userId: string,
  picturePath?: string,
  tags?: Tag[],
) {
  const post = await prisma.post.create({
    data: {
      title,
      content,
      picturePath,
      showId,
      authorId: userId,
      tags: { connect: tags },
    },
  });

  return post;
}
