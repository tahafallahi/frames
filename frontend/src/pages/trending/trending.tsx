import QueryWrapper from "@/components/query-wrapper/query-wrapper";
import ShowsColumn from "@/components/shows-column/shows-column";
import { api } from "@/lib/api";
import type { Show } from "@/types/show";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export default function Trending({
  mediaTypeProp,
}: {
  mediaTypeProp: "MOVIE" | "TV_SHOW";
}) {
  const [mediaType, setMediaType] = useState(mediaTypeProp);

  const showQuery = useQuery({
    queryKey: ["show", mediaType],
    queryFn: async () =>
      (
        await api.get<Show[]>(
          `/trending/${mediaType === "MOVIE" ? "movie" : "tv"}`,
        )
      ).data,
  });

  return (
    <>
      <div >
        <QueryWrapper query={showQuery}>
          {showQuery.data && (
            <ShowsColumn
              shows={showQuery.data}
              mediaType={mediaType}
              setMediaType={setMediaType}
            />
          )}
        </QueryWrapper>
      </div>
    </>
  );
}
