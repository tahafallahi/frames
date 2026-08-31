import type { User } from "./user";

export interface Comment {
  text: string;
  user: User;
  replies: Comment[];
  likes: number;
}
