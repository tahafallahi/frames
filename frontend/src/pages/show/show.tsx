import Filter from "@/components/filter/filter";
import PostsColumn from "@/components/posts-column/posts-column";
import QueryWrapper from "@/components/query-wrapper/query-wrapper";
import ShowCard from "@/components/show-card/show-card";
import Skeleton from "@/components/skeleton/skeleton";
import { useFeedSort } from "@/contexts/feed-sort-context";
import { useUser } from "@/contexts/user-context";
import { postsQueryOpts, showQueryOpts, tagsQueryOpts } from "@/lib/queryOptions";
import type { SelectedFilters } from "@/types/filter";
import { MediaType, type Show } from "@/types/show";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useParams } from "react-router";

export default function Show() {
  const { showId, mediaType: mediaTypeString } = useParams();
  const showFilter = [Number(showId!)]
  //This is for uniformity with other queries calls so userquery can cashe the result
  const mediaType =
    mediaTypeString === "movie" ? MediaType.MOVIE : MediaType.TV_SHOW;
  const [sort, setSort] = useFeedSort();
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>({
    Content: [],
    Tags: [],
  });
  const [user] = useUser()

  const showQuery = useQuery(showQueryOpts(Number(showId), mediaType));

  const tagQuery = useQuery(tagsQueryOpts());

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
          queryOptions={postsQueryOpts(user?.id, sort, selectedFilters, showFilter)}
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
