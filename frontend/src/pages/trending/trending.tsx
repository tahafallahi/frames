import QueryWrapper from "@/components/query-wrapper/query-wrapper";
import ShowsColumn from "@/components/shows-column/shows-column";
import { api } from "@/lib/api";
import type { Show } from "@/types/show";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";

export default function Trending({
  mediaTypeProp,
}: {
  mediaTypeProp: "MOVIE" | "TV_SHOW";
}) {
  const [mediaType, setMediaType] = useState(mediaTypeProp);
  const loadMoreRef = useRef(null);

  const showQuery = useInfiniteQuery({
    queryKey: ["show", mediaType],
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages, lastPageparam) => lastPageparam + 1,
    queryFn: async ({ pageParam }) =>
      (
        await api.get<Show[]>(
          `/trending/${mediaType === "MOVIE" ? "movie" : "tv"}?page=${pageParam}`,
        )
      ).data,
  });

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) void showQuery.fetchNextPage() ;
      });
    });

    observer.observe(loadMoreRef.current!);
  });

  console.log(showQuery.data);

  return (
    <>
      <div>
        <QueryWrapper query={showQuery}>
          {showQuery.data && (
            <ShowsColumn
              shows={showQuery.data.pages.flat()}
              mediaType={mediaType}
              setMediaType={setMediaType}
            />
          )}
        </QueryWrapper>
        <div ref={loadMoreRef}></div>
      </div>
    </>
  );
}
