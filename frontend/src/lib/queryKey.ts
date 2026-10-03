import { queryOptions } from "@tanstack/react-query";
import { api } from "./api";
import type { Post } from "@/types/post";

export const postQuery = (userId?: string, postId?: string) =>
  queryOptions({
    queryKey: ["user", userId, "post", postId],
    queryFn: async () => {
      return (await api.get<Post>("/posts/" + postId)).data;
    },
    enabled: !!postId
  });
