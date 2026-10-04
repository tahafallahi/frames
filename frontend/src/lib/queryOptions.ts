import { queryOptions } from "@tanstack/react-query";
import { api } from "./api";
import type { Post } from "@/types/post";
import type { Comment } from "@/types/comment";
import type { SelectedFilters } from "@/types/filter";
import { FeedSortDict, type FeedSortEnum } from "@/types/contexts";
import { MediaType } from "@/types/show";

export const postQueryOpts = (userId?: string, postId?: string) =>
  queryOptions({
    queryKey: ["user", userId, "post", postId],
    queryFn: async () => {
      return (await api.get<Post>("/posts/" + postId)).data;
    },
    enabled: !!postId,
  });

export const postsQueryOpts = (
  userId: string | undefined,
  page: number,
  sort: FeedSortEnum,
  selectedFilters: SelectedFilters,
) =>
  queryOptions({
    queryKey: ["user", userId, "posts", page, sort, selectedFilters],
    queryFn: async () => {
      return (
        await api.get<Post[]>("/posts", {
          params: {
            sort: FeedSortDict[sort].value,
            page: 1,
            mediaFilter: selectedFilters.Content.map((f) =>
              f === "Movie" ? MediaType.MOVIE : MediaType.TV_SHOW,
            ),
            tagFilter: selectedFilters.Tags,
          },
        })
      ).data;
    },
  });

export const commentsQueryOpts = (userId?: string, postId?: string) =>
  queryOptions({
    queryKey: ["user", userId, "post", postId, "comments"],
    queryFn: async () => {
      return (await api.get<Comment[]>("/posts/" + postId + "/comments")).data;
    },
    enabled: !!postId,
  });

export const commentQueryOpts = (
  commentId: string,
  userId?: string,
  postId?: string,
) =>
  queryOptions({
    queryKey: ["user", userId, "post", postId, "comments", commentId],
    queryFn: async () => {
      return (
        await api.get<Comment>("/posts/" + postId + "/comments/" + commentId)
      ).data;
    },
    enabled: !!commentId,
  });
