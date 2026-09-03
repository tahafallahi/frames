export enum MediaType {
  MOVIE,
  TV_SHOW,
}

export interface Show {
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
}