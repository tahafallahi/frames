import { useEffect, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

import ShowsColumn from "@/components/shows-column/shows-column";

import type { Show } from "@/types/show";

export default function Trending({
  mediaType,
}: {
  mediaType: "MOVIE" | "TV_SHOW";
}) {
  const loadMoreRef = useRef(null);

  const showQuery = useInfiniteQuery({
    queryKey: ["show", mediaType],
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages, lastPageparam) => lastPageparam + 1,
    queryFn: async ({ pageParam }) =>
      (
        await api.get<Show[]>(
          `/trending/${mediaType === "MOVIE" ? "movie" : "tv"}`,
          {
            params: {
              page: pageParam,
            },
          },
        )
      ).data,
  });

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) void showQuery.fetchNextPage();
      });
    });

    observer.observe(loadMoreRef.current!);
  });

  return (
    <>
      <div>
        <ShowsColumn query={showQuery} mediaType={mediaType} />
        <div ref={loadMoreRef}></div>
      </div>
    </>
  );
}
