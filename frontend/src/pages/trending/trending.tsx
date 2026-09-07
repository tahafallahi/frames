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

  const showQuery = useInfiniteQuery<Show[], Error>({
    queryKey: ["show", mediaType],
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages, lastPageParam) => lastPageParam + 1,
    queryFn: async ({ pageParam }): Promise<Show[]> =>
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
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) void showQuery.fetchNextPage();
        });
      },
      { rootMargin: "0px 0px 1500px 0px " },
    );

    observer.observe(loadMoreRef.current!);
  }, []);

  return (
    <>
      <div className="col-span-2">
        <ShowsColumn query={showQuery} mediaType={mediaType} />
        <div ref={loadMoreRef}></div>
        {showQuery.isFetchingNextPage && (
          <div className="grid grid-cols-[repeat(auto-fit,minmax(100px,240px))] gap-2">
            {Array(4)
              .fill(null)
              .map((x, i) => (
                <Skeleton key={i} className="h-auto w-full aspect-2/3" />
              ))}
          </div>
        )}
      </div>
    </>
  );
}
