export interface User {
  id: string;
  username: string;
  email: string | null;
  profilePath: string | null;
  bio: string | null;
  likesCount: number | null;
  follwersCount: number | null;
  followingsCount: number | null;
  postsCount: number | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export interface ApiSearchUser {
  id: string;
  username: string;
  profilePath: string;
}