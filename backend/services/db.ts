import { MediaType } from "generated/prisma/enums";
import { prisma } from "lib/prisma";
import type { Show } from "types/show";
import { getMovieFromTmdb, getTvFromTmdb } from "./tmdb-services";

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
    where: { AND: { tmdbId: Number(tmdbId), mediaType: mediaType } },
  });

  if (result) {
      const { _count, ...rest } = result;
      const show = {
        ...rest,
        postsCount: _count.posts,
        favouritesCount: _count.users,
      };
      return show
  };

  const tmdbResult =
    mediaType === MediaType.MOVIE
      ? await getMovieFromTmdb(tmdbId)
      : await getTvFromTmdb(tmdbId);


  if (!tmdbResult) throw ;

  return res.json(tmdbResult);
}
