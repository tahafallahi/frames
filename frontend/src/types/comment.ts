import type { User } from "./user";

export interface Comment {
  id: string;
  content: string;
  author: Pick<User, "id" |"username" | "profilePath">
  replies: Comment[];
  createdAt: Date;
  updatedAt: Date;
  repliesCount: number;
  likesCount: number;
}

export interface CommentForm {
  content: string;
  postId: string;
}