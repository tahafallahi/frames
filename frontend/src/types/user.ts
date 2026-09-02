import type { Show } from "./show";

export interface User {
  id: string;
  username: string;
  email: string | null;
  profilePath: string | null;
  bio: string | null;
  likesCount: number;
  follwersCount: number ;
  followingsCount: number;
  postsCount: number;
  favorites?: Show[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiSearchUser {
  id: string;
  username: string;
  profilePath: string;
}