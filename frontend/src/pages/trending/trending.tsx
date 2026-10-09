import { useEffect, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

import ShowsColumn from "@/components/shows-column/shows-column";

import type { Show } from "@/types/show";
import Skeleton from "@/components/skeleton/skeleton";

export default function Trending({
  mediaType,
}: {
  mediaType: "MOVIE" | "TV_SHOW";
}) {
  const loadMoreRef = useRef(null);

  const showQuery = useInfiniteQuery({
    queryKey: ["show", mediaType],
    initialPageParam: 1,
    getNextPageParam: (lastPage, _allPages, lastPageParam) =>
      lastPage.length ? lastPageParam + 1 : undefined,
    queryFn: async ({ pageParam }: { pageParam: number }) =>
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

  const fetchNextPage = showQuery.fetchNextPage;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) void fetchNextPage();
        });
      },
      { rootMargin: "0px 0px 1500px 0px " },
    );

    observer.observe(loadMoreRef.current!);

    return () => observer.disconnect();
  }, [fetchNextPage]);

  return (
    <>
      <div className="col-span-2">
        <ShowsColumn query={showQuery} mediaType={mediaType} />
        <div ref={loadMoreRef}></div>
        {showQuery.isFetchingNextPage && (
            <div className="grid grid-cols-[repeat(auto-fit,minmax(100px,240px))] gap-2 mt-2">
              {Array(4)
                .fill(null)
                .map((_x, i) => (
                  <Skeleton key={i} className="h-auto w-full aspect-2/3" />
                ))}
          </div>
        )}
      </div>
    </>
  );
}
