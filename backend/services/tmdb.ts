import { MediaType } from "generated/prisma/enums";
import { tmdbApi } from "lib/api";
import { type ApiSearchShow, type Show } from "types/show";
import { movieGenreIdToName, tvGenreIdToName } from "utils/tmdb";

export async function searchMovie(
  query: string,
  limit: number,
): Promise<ApiSearchShow[]> {
  const movieData = await tmdbApi.get(`/search/movie?query=${query}`);

  const movies = movieData.data.results.slice(0, limit).map((r: any) => {
    return {
      tmdbId: r.id,
      title: r.title,
      posterPath: r.poster_path,
      releaseDate: r.release_date,
    };
  });

  return movies;
}

export async function searchTV(
  query: string,
  limit: number,
): Promise<ApiSearchShow[]> {
  const tvData = await tmdbApi.get(`/search/tv?query=${query}`);

  const tvs = tvData.data.results.slice(0, limit).map((r: any) => {
    return {
      tmdbId: r.id,
      title: r.name,
      posterPath: r.poster_path,
      releaseDate: r.first_air_date,
    };
  });

  return tvs;
}

export async function getMovieFromTmdb(movieId: number): Promise<Show> {
  const movie = (await tmdbApi.get("/movie/" + movieId)).data;

  return {
    tmdbId: movie.id,
    title: movie.title,
    overview: movie.overview,
    posterPath: movie.poster_path,
    releaseYear: movie.release_date.split("-")[0],
    mediaType: MediaType.MOVIE,
    genres: movie.genres.map((g: { id: Number; name: String }) => g.name),
  };
}

export async function getTvFromTmdb(tvId: number): Promise<Show> {
  const tv = (await tmdbApi.get("/tv/" + tvId)).data;

  return {
    tmdbId: tv.id,
    title: tv.name,
    overview: tv.overview,
    posterPath: tv.poster_path,
    releaseYear: tv.first_air_date.split("-")[0],
    mediaType: MediaType.TV_SHOW,
    genres: tv.genres.map((g: { id: Number; name: String }) => g.name),
  };
}

export async function getTrendingMoviesTmdb(page: number): Promise<Show[]> {
  const movies = (await tmdbApi.get(`/movie/popular?page=${page}`)).data
    .results;

  return movies.map((movie: any) => ({
    tmdbId: movie.id,
    title: movie.title,
    overview: movie.overview,
    posterPath: movie.poster_path,
    releaseYear: movie.release_date.split("-")[0],
    mediaType: MediaType.MOVIE,
    genres: movie.genre_ids.map((id: number) => movieGenreIdToName(id)),
  }));
}


export async function getTrendingTvTmdb(page: number): Promise<Show[]> {
  const tvs = (await tmdbApi.get(`/tv/popular?page=${page}`)).data
    .results;

  return tvs.map((movie: any) => ({
    tmdbId: movie.id,
    title: movie.name,
    overview: movie.overview,
    posterPath: movie.poster_path,
    releaseYear: movie.first_air_date.split("-")[0],
    mediaType: MediaType.TV_SHOW,
    genres: movie.genre_ids.map((id: number) => tvGenreIdToName(id)),
  }));
}