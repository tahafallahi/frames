import type { MediaType } from "generated/prisma/enums";

export interface ShowIdentifier {
  tmdbId: number;
  mediaType: MediaType;
}

export interface ApiSearchShow {
  tmdbId: number;
  title: string;
  posterPath: string;
  mediaType: MediaType;
  releaseDate: string;
}

export interface Show {
  id: string;
  tmdbId: number;
  title: string;
  overview: string;
  posterPath: string | null;
  mediaType: MediaType;
  genres: string[]
  releaseYear: number;
  postsCount?: number;
  favoritesCount?: number;
}

