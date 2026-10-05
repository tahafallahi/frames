import { queryOptions } from "@tanstack/react-query";
import { api } from "./api";
import type { Post } from "@/types/post";
import type { Comment } from "@/types/comment";
import type { SelectedFilters } from "@/types/filter";
import { FeedSortDict, type FeedSortEnum } from "@/types/contexts";
import { MediaType, type Show } from "@/types/show";

const STALE_TIME = 5 * 10 * 1000;

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
  selectedFilters?: SelectedFilters,
  showId?: number[],
  userFilter?: string[],
) =>
  queryOptions({
    queryKey: [
      "user",
      userId,
      "posts",
      page,
      sort,
      selectedFilters,
      showId,
      userFilter,
    ],
    queryFn: async () => {
      return (
        await api.get<Post[]>("/posts", {
          params: {
            sort: FeedSortDict[sort].value,
            page: page,
            mediaFilter: selectedFilters?.Content.map((f) =>
              f === "Movie" ? MediaType.MOVIE : MediaType.TV_SHOW,
            ),
            tagFilter: selectedFilters?.Tags,
            showFilter: showId,
            userFilter: userFilter,
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

export const tagsQueryOpts = () =>
  queryOptions({
    queryKey: ["tags"],
    queryFn: async () =>
      (await api.get<{ id: number; name: string }[]>(`/tags`)).data,
    staleTime: STALE_TIME,
  });

export const showQueryOpts = (showId: number, mediaType: MediaType) =>
  queryOptions({
    queryKey: ["show", showId, mediaType],
    queryFn: async () =>
      (
        await api.get<Show>(
          "/shows/" +
            (mediaType === MediaType.MOVIE ? "movie" : "tv") +
            "/" +
            showId,
        )
      ).data,
    staleTime: STALE_TIME,
  });
