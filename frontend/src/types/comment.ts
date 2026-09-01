import type { User } from "./user";

export interface Comment {
  id: string;
  content: string;
  author: Pick<User, "username" | "profilePath">
  replies: Comment[];
  createdAt: Date;
  updatedAt: Date;
  repliesCount: number;
  likesCount: number;
}
