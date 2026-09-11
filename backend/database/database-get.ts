import { MediaType } from "generated/prisma/enums";
import { prisma } from "lib/prisma";
import type { Show } from "types/show";
import { getMovieFromTmdb, getTvFromTmdb } from "../services/tmdb-services";
import { isAxiosError } from "axios";
import { NotFoundError } from "error/AppErrors";
import configs from "configs";
import type { PostOrderByWithRelationInput } from "generated/prisma/models";

export async function getOrCreateShow(
  tmdbId: number,
  mediaType: MediaType,
): Promise<Show> {
  const result = await prisma.show.findFirst({
    select: {
      id: true,
      tmdbId: true,
      title: true,
      overview: true,
      mediaType: true,
      posterPath: true,
      releaseYear: true,
      genres: true,
      _count: {
        select: {
          posts: true,
          users: true,
        },
      },
    },
    where: { AND: { tmdbId: tmdbId, mediaType: mediaType } },
  });

  if (result) {
    const { _count, ...rest } = result;
    const show = {
      ...rest,
      postsCount: _count.posts,
      favouritesCount: _count.users,
    };
    return show;
  } else {
    try {
      const tmdbResult =
        mediaType === MediaType.MOVIE
          ? await getMovieFromTmdb(tmdbId)
          : await getTvFromTmdb(tmdbId);
      const show = await prisma.show.create({ data: tmdbResult });

      return show;
    } catch (error) {
      if (isAxiosError(error) && error.status === 404) {
        throw new NotFoundError(tmdbId.toString());
      } else {
        throw error;
      }
    }
  }
}

export async function getShow(
  tmdbId: number,
  mediaType: MediaType,
): Promise<Show> {
  const result = await prisma.show.findFirst({
    select: {
      id: true,
      tmdbId: true,
      title: true,
      overview: true,
      mediaType: true,
      posterPath: true,
      releaseYear: true,
      genres: true,
      _count: {
        select: {
          posts: true,
          users: true,
        },
      },
    },
    where: { AND: { tmdbId: tmdbId, mediaType: mediaType } },
  });

  if (result) {
    const { _count, ...rest } = result;
    const show = {
      ...rest,
      postsCount: _count.posts,
      favouritesCount: _count.users,
    };
    return show;
  } else {
    try {
      const tmdbResult =
        mediaType === MediaType.MOVIE
          ? await getMovieFromTmdb(tmdbId)
          : await getTvFromTmdb(tmdbId);

      const show = {
        ...tmdbResult,
        postsCount: 0,
        favouritesCount: 0,
      };
      return show;
    } catch (error) {
      if (isAxiosError(error) && error.status === 404) {
        throw new NotFoundError(`Show with id ${tmdbId.toString()}`);
      } else {
        throw error;
      }
    }
  }
}

export async function getUser(userId: string) {
  const result = await prisma.user.findUnique({
    select: {
      id: true,
      username: true,
      email: true,
      profilePath: true,
      bio: true,
      createdAt: true,
      updatedAt: true,
      favorites: true,
      following: true,
      _count: {
        select: {
          followers: true,
          following: true,
          likes: true,
          posts: true,
        },
      },
    },
    where: { id: userId },
  });

  if (!result) throw new NotFoundError("User");

  const { _count, ...rest } = result;

  const user: Express.User = {
    ...rest,
    followingsCount: _count.following,
    follwersCount: _count.followers,
    likesCount: _count.likes,
    postsCount: _count.posts,
  };

  return user;
}

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
    mediaFilter?: string[];
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
    },
    where: {
      AND: {
        ...(filters.tagFilter && {
          tags: { some: { name: { in: filters.tagFilter as string[] } } },
        }),
        ...(filters.mediaFilter && {
          show: { mediaType: { in: filters.mediaFilter as string[] } },
        }),
        ...(filters.userFilter && {
          authorId: { in: filters.userFilter as string[] },
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

  if (!result.length) throw new NotFoundError("Posts");

  const posts = result.map(({ _count, ...post }) => ({
    ...post,
    likesCount: _count.likes,
    commentsCount: _count.comments,
  }));

  return posts;
}

