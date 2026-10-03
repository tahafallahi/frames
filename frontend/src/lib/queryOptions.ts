import { queryOptions } from "@tanstack/react-query";
import { api } from "./api";
import type { Post } from "@/types/post";
import type { Comment } from "@/types/comment";

export const postQueryOpts = (userId?: string, postId?: string) =>
  queryOptions({
    queryKey: ["user", userId, "post", postId],
    queryFn: async () => {
      return (await api.get<Post>("/posts/" + postId)).data;
    },
    enabled: !!postId
  });

export const commentsQueryOpts = (userId?: string, postId?: string) =>
  queryOptions({
    queryKey: ["user", userId, "post", postId, "comments"],
    queryFn: async () => {
      return (await api.get<Comment[]>("/posts/" + postId + "/comments")).data;
    },
    enabled: !!postId
  });