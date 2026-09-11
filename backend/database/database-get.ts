import { MediaType } from "generated/prisma/enums";
import { prisma } from "lib/prisma";
import type { Show } from "types/show";
import { getMovieFromTmdb, getTvFromTmdb } from "../services/tmdb-services";
import { isAxiosError } from "axios";
import { NotFoundError } from "error/AppErrors";

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
