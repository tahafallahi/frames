import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { api } from "@/lib/api";

import PostsColumn from "@/components/posts-column/posts-column";
import Filter from "@/components/filter/filter";

import type { Post } from "@/types/post";
import type { SelectedFilters } from "@/types/filter";
import { MediaType } from "@/types/show";
import { useFeedSort } from "@/contexts/feed-sort-context";
import { FeedSortDict } from "@/types/contexts";

export default function Feed() {
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>({
    Content: [],
    Tags: [],
  });
  const [sort, setSort] = useFeedSort();

  const postsResponse = useQuery({
    queryKey: ["posts", sort, selectedFilters],
    queryFn: async () =>
      (
        await api.get<Post[]>("/posts", {
          params: {
            sort: FeedSortDict[sort].value,
            page: 1,
            mediaFilter: selectedFilters.Content.map((f => f === "Movie"? MediaType.MOVIE: MediaType.TV_SHOW)),
            tagFilter: selectedFilters.Tags,
          },
        })
      ).data,
      staleTime: 0,
  });

  const tagsResponse = useQuery({
    queryKey: ["tags"],
    queryFn: async () =>
      (await api.get<{ id: number; name: string }[]>(`/tags`)).data,
  });

  const filter = tagsResponse.data
    ? [
        {
          title: "Content",
          items: ["Movie", "TV Show"],
        },
        {
          title: "Tags",
          items: tagsResponse.data.map((t) => {
            return t.name;
          }),
        },
      ]
    : [];

  return (
    <>
      <PostsColumn
        query={postsResponse}
        title="All"
        sort={sort}
        setSort={setSort}
      />
      <Filter
        query={tagsResponse}
        filters={filter}
        selectedFilters={selectedFilters}
        setSelectedFilters={setSelectedFilters}
      ></Filter>
    </>
  );
}
