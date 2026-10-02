import type { ApiSearchPost } from "./post";
import type { ApiSearchShow } from "./show";
import type { SimpleUser } from "./user";

export interface ApiSearchResponse {
  users: SimpleUser[];
  posts: ApiSearchPost[];
  movies: ApiSearchShow[];
  tvs: ApiSearchShow[];
}