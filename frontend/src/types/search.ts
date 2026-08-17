export interface ApiSearchResponse {
  users: ApiSearchUser[];
  posts: ApiSearchPost[];
  movies: ApiSearchMovie[];
  tvs: ApiSearchTvShow[];
}

export interface ApiSearchUser {
  id: string;
  username: string;
  profilePath: string;
}

export interface ApiSearchPost {
  id: string;
  title: string;
  showMediaType: "MOVIE" | "TV_SHOW";
  showTitle: string;
  likes: number; 
}

export interface ApiSearchMovie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
}

export interface ApiSearchTvShow {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
}