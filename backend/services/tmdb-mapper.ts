import { MediaType } from "generated/prisma/enums";
import type { Show } from "types/show";
import type { TmdbMovieDetails, TmdbTvShowDetails } from "types/tmdb";

export function mapTmdbShowToDb(
  tmdbShow: TmdbMovieDetails | TmdbTvShowDetails,
  mediaType: MediaType,
) {
  const show: Show = {
    tmdbId: tmdbShow.id,
    title:
      mediaType === MediaType.MOVIE
        ? (tmdbShow as TmdbMovieDetails).title
        : (tmdbShow as TmdbTvShowDetails).name,
    overview: tmdbShow.overview,
    posterPath: tmdbShow.poster_path,
    mediaType: mediaType,
    genres: tmdbShow.genres.map((s) => s.name),
    releaseYear:
      mediaType === MediaType.MOVIE
        ? Number((tmdbShow as TmdbMovieDetails).release_date.split("-")[0])
        : Number((tmdbShow as TmdbTvShowDetails).first_air_date?.split("-")[0]),
  };

  return show;
}
