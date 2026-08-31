import type { ApiSearchPost } from "./post";
import type { ApiSearchShow } from "./show";
import type { ApiSearchUser } from "./user";

export interface ApiSearchResponse {
  users: ApiSearchUser[];
  posts: ApiSearchPost[];
  movies: ApiSearchShow[];
  tvs: ApiSearchShow[];
}