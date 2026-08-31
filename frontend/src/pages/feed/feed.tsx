import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { api } from "@/lib/api";

import PostsColumn from "@/components/posts-column/posts-column";
import QueryWrapper from "@/components/query-wrapper/query-wrapper";
import Filter from "@/components/filter/filter";

import type { Post } from "@/types/feed";
import type {SelectedFilters } from "@/types/types";

export default function Feed() {
  const [selectedFilters, setSelectedFilters] =
    useState<SelectedFilters>({Content: [], Tags: []});
  const [sort, setSort] = useState<"TOP" | "HOT" | "NEW">("TOP");
  const qSort = {TOP: "likes", HOT: "comments", NEW: "time"}[sort]

  const postsResponse = useQuery({
    queryKey: ["posts", qSort, selectedFilters],
    queryFn: async () =>
      (await api.get<Post[]>(`/posts?sort=${qSort}&page=1&mediaFilter=${selectedFilters.Content.join(",")}&tagFilter=${selectedFilters.Tags.join(",")}`)).data,
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
          items: ["movie", "tv show"],
        },
        {
          title: "Tags",
          items: tagsResponse.data.map((t) => {
            return  t.name;
          }),
        },
      ]
    : [];

  return (
    <div className="grid grid-cols-[1fr_fit-content(100ch)] items-start justify-items gap-12">
      <QueryWrapper
        query={postsResponse}
        emptyStateMessage={"There are no posts."}
      >
        <PostsColumn
          posts={postsResponse.data}
          title="All"
          sort={sort}
          setSort={setSort}
        />
      </QueryWrapper>
      <QueryWrapper
        query={tagsResponse}
        emptyStateMessage={"There are no tags."}
      >
        <Filter filters={filter} selectedFilters={selectedFilters} setSelectedFilters={setSelectedFilters}></Filter>
      </QueryWrapper>
    </div>
  );
}
