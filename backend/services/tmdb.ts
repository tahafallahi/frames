import { tmdbApi } from "lib/api";

export async function searchMovie(query: string, limit: number) {
  const movieData = await tmdbApi.get(`/search/movie?query=${query}`);

  const movies = movieData.data.results.slice(0, limit).map((r: any) => {
    return {
      id: r.id,
      title: r.title,
      poster_path: r.poster_path,
      release_date: r.release_date,
    };
  });

  return movies
}

export async function searchTV(query: string, limit: number) {
  const tvData = await tmdbApi.get(`/search/tv?query=${query}`);

  const tvs = tvData.data.results.slice(0, limit).map((r: any) => {
    return {
      id: r.id,
      title: r.title,
      poster_path: r.poster_path,
      release_date: r.first_air_date,
    };
  });

  return tvs
}
