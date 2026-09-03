export enum MediaType {
  MOVIE,
  TV_SHOW,
}

export interface ApiSearchShow {
  tmdbId: number;
  title: string;
  posterPath: string;
  mediaType: MediaType;
  releaseDate: string;
}

export interface ShowFromTmdb {
  tmdbId: number;
  title: string;
  overview: string;
  posterPath: string;
  mediaType: MediaType;
  genres: string[]
  releaseYear: string;
}

export interface ShowFromDb {
  id: string;
  tmdbId: number;
  title: string;
  overview: string;
  posterPath: string;
  mediaType: MediaType;
  releaseYear: string;
}
