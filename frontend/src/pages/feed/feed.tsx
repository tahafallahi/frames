import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import PostsColumn from "@/components/posts-column/posts-column";
import Filter from "@/components/filter/filter";

import type { SelectedFilters } from "@/types/filter";
import { useFeedSort } from "@/contexts/feed-sort-context";
import { postsQueryOpts, tagsQueryOpts } from "@/lib/queryOptions";
import { useUser } from "@/contexts/user-context";

export default function Feed() {
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>({
    Content: [],
    Tags: [],
  });
  const [sort, setSort] = useFeedSort();
  const [user] = useUser()

  const postsResponse = useQuery(postsQueryOpts(user?.id, 1, sort, selectedFilters));

  const tagsResponse = useQuery(tagsQueryOpts());

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
