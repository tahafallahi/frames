import PostForm from "@/components/post-form/post-form";
import QueryWrapper from "@/components/query-wrapper/query-wrapper";
import ShowCard from "@/components/show-card/show-card";
import Skeleton from "@/components/skeleton/skeleton";
import { api } from "@/lib/api";
import {
  MediaType,
  type ApiSearchShow,
  type Show,
  type ShowIdentifier,
} from "@/types/show";
import { useQuery } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { useSearchParams } from "react-router";

const DEBOUNCE_DELAY = 300;

export default function CreatePost() {
  const timeoutId = useRef<number>(null);
  const [searchParams] = useSearchParams();

  const showId = Number(searchParams.get("showId"));
  const mediaType = searchParams.get("mediaType") as "MOVIE" | "TV_SHOW";

  const [show, setShow] = useState<ShowIdentifier | null>(
    showId && mediaType
      ? {
          tmdbId: showId,
          mediaType: (mediaType === "MOVIE" ? MediaType.MOVIE : MediaType.TV_SHOW),
        }
      : null,
  );

  console.log(typeof show!.tmdbId, typeof show!.mediaType);

  const showQuery = useQuery({
    queryKey: ["show", show!.tmdbId, show!.mediaType],
    queryFn: async () =>
      (
        await api.get<Show>(
          `/shows/${show?.mediaType === MediaType.MOVIE ? "movie" : "tv"}/${show?.tmdbId}`,
        )
      ).data,
    enabled: !!show,
  });

  function debounceSetShow(show: ApiSearchShow | null) {
    if (timeoutId.current) clearTimeout(timeoutId.current);
    timeoutId.current = setTimeout(() => {
      setShow(show);
    }, DEBOUNCE_DELAY);
  }

  function handleFormSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    const form = new FormData(e.target);
  }

  return (
    <>
      <div>
        <PostForm
          handleFormSubmit={handleFormSubmit}
          setShow={debounceSetShow}
        />
      </div>
      <div>
        {showQuery.isEnabled && show && (
          <QueryWrapper
            query={showQuery}
            isEmpty={!!(showQuery.data && !Object.keys(showQuery.data).length)}
            loadingPlaceHolder={
              <div>
                <Skeleton className="h-7 mb-4" />
                <Skeleton className="ml-4 h-100" />
                <div className="ml-4 mt-4 flex flex-col gap-2">
                  <Skeleton variant="line" />
                  <Skeleton variant="line" />
                  <Skeleton variant="line" />
                  <Skeleton variant="line" />
                  <Skeleton variant="line" />
                  <Skeleton variant="line" className="w-50" />
                  <Skeleton variant="line" className="w-50" />
                </div>
              </div>
            }
          >
            {showQuery.data && (
              <ShowCard show={showQuery.data} title overview />
            )}
          </QueryWrapper>
        )}
      </div>
    </>
  );
}
