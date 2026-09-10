import Filter from "@/components/filter/filter";
import PostsColumn from "@/components/posts-column/posts-column";
import QueryWrapper from "@/components/query-wrapper/query-wrapper";
import ShowCard from "@/components/show-card/show-card";
import Skeleton from "@/components/skeleton/skeleton";
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
        await api.get<Post[]>(`/posts`, {
          params: {
            sort: qSort,
            page: 1,
            showFilter: [showId],
            tagFilter: selectedFilters.Tags,
          },
        })
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
        <PostsColumn
          query={postsQuery}
          title={showQuery.data?.title ?? ""}
          sort={sort}
          setSort={setSort}
        />
      </div>
      <div className="flex flex-col gap-12">
        <QueryWrapper
          query={showQuery}
          isEmpty={!!(showQuery.data && !Object.keys(showQuery.data).length)}
          loadingPlaceHolder={
            <div className="flex flex-col gap-2">
              <Skeleton className="h-100" />
              <Skeleton variant="line" />
              <Skeleton variant="line" />
              <Skeleton variant="line" />
              <Skeleton variant="line" />
            </div>
          }
        >
          {showQuery.isSuccess ? (
            <ShowCard
              show={showQuery.data}
              buttons={["writePost", "favorite"]}
              overview
            />
          ) : (
            <p>empty</p>
          )}
        </QueryWrapper>
        <Filter
          query={tagQuery}
          filters={filter}
          selectedFilters={selectedFilters}
          setSelectedFilters={setSelectedFilters}
        />
      </div>
    </>
  );
}
