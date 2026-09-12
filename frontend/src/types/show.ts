export enum MediaType {
  MOVIE = "MOVIE",
  TV_SHOW = "TV_SHOW"
}

export interface Show {
  id: string;
  tmdbId: number;
  title: string;
  overview: string;
  releaseYear: number;
  mediaType: MediaType;
  posterPath: string;
  genres: string[]
  postsCount: number;
  favouritesCount: number;
}

export interface ApiSearchShow {
  tmdbId: number;
  title: string;
  posterPath: string;
  releaseDate: string;
  mediaType: MediaType;
}

export interface ShowIdentifier {
  tmdbId: number;
  mediaType: MediaType;
}

export interface TrendingTitles {
  movies: {title: string, tmdbId: number}[]
  tvs: {title: string, tmdbId: number}[]
}