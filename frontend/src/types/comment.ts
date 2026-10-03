import type { Reaction } from "./reaction";
import type { User } from "./user";

export interface Comment {
  id: string;
  content: string;
  author: Pick<User, "id" | "username" | "profilePath">;
  replies: Comment[];
  createdAt: Date;
  updatedAt: Date;
  repliesCount: number;
  likesCount: number;
  reaction: Reaction;
}

export interface CommentForm {
  content: string;
  postId: string;
}
