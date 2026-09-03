import Filter from "@/components/filter/filter";
import PostsColumn from "@/components/posts-column/posts-column";
import QueryWrapper from "@/components/query-wrapper/query-wrapper";
import ShowCard from "@/components/show-card/show-card";
import { api } from "@/lib/api";
import type { SelectedFilters } from "@/types/filter";
import type { Post } from "@/types/post";
import type { Show } from "@/types/show";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useParams } from "react-router";

export default function Show() {
  const { showId, mediaType } = useParams();
  const [sort, setSort] = useState<"TOP" | "HOT" | "NEW">("TOP");
  const qSort = { TOP: "likes", HOT: "comments", NEW: "time" }[sort];
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>({
    Content: [],
    Tags: [],
  });

  const postsQuery = useQuery({
    queryKey: ["posts", qSort, showId, selectedFilters],
    queryFn: async () =>
      (
        await api.get<Post[]>(
          `/posts?sort=${qSort}&page=1&showFilter=${showId}&tagFilter=${selectedFilters.Tags.join(",")}`,
        )
      ).data,
  });

  const showQuery = useQuery({
    queryKey: ["show", showId, mediaType],
    queryFn: async () => {
      return (await api.get<Show>("/shows/" + mediaType + "/" + showId)).data;
    },
  });

  const tagQuery = useQuery({
    queryKey: ["tags"],
    queryFn: async () =>
      (await api.get<{ id: number; name: string }[]>(`/tags`)).data,
  });

  const filter = tagQuery.data
    ? [
        {
          title: "Tags",
          items: tagQuery.data.map((t) => {
            return t.name;
          }),
        },
      ]
    : [];

  return (
    <>
      <div>
        <QueryWrapper query={postsQuery}>
          {(postsQuery.data && postsQuery.data.length > 0) ? (
            <PostsColumn
              posts={postsQuery.data}
              title={showQuery.data?.title ?? ""}
              sort={sort}
              setSort={setSort}
            />
          ) : (
            <p>empty</p>
          )}
        </QueryWrapper>
      </div>
      <div className="flex flex-col gap-12 pt-12">
        <QueryWrapper query={showQuery}>
          {showQuery.data ? (
            <ShowCard show={showQuery.data} variant="detailedOmitTitle" />
          ) : (
            <p>empty</p>
          )}
        </QueryWrapper>
        <QueryWrapper query={tagQuery}>
          {tagQuery.data && (
            <Filter
              filters={filter}
              selectedFilters={selectedFilters}
              setSelectedFilters={setSelectedFilters}
            />
          )}
        </QueryWrapper>
      </div>
    </>
  );
}
