export interface ApiSearchShow {
  tmdbId: number;
  title: string;
  posterPath: string;
  mediaType: "MOVIE" | "TV_SHOW";
  releaseDate: string;
}

export interface Show {
  id: string;
  tmdbId: number;
  title: string;
  overview: string;
  posterPath: string | null;
  mediaType: "MOVIE" | "TV_SHOW";
  genres: string[]
  releaseYear: number;
  postsCount?: number;
  favoritesCount?: number;
}
