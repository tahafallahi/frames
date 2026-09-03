export interface ApiSearchShow {
  tmdbId: number;
  title: string;
  posterPath: string;
  mediaType: "MOVIE" | "TV_SHOW";
  releaseDate: string;
}

export interface Show {
  tmdbId: number;
  title: string;
  overview: string;
  posterPath: string;
  mediaType: "MOVIE" | "TV_SHOW";
  genres: string[]
  releaseYear: string;
  postsCount?: number;
  favoritesCount?: number;
}
