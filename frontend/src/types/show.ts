export enum MediaType {
  MOVIE,
  TV_SHOW,
}

export interface Show {
  id: number;
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
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
}