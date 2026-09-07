import { ChevronDown } from "lucide-react";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import ShowCard from "../show-card/show-card";
import { Link } from "react-router";
import type {
  InfiniteData,
  UseInfiniteQueryResult,
} from "@tanstack/react-query";
import QueryWrapper from "../query-wrapper/query-wrapper";
import type { Show } from "@/types/show";
import Skeleton from "../skeleton/skeleton";

export default function ShowsColumn({
  query,
  mediaType,
}: {
  query: UseInfiniteQueryResult<InfiniteData<Show[], unknown>, Error>;
  mediaType: "MOVIE" | "TV_SHOW";
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between text-2xl">
        <div className="flex items-center gap-2">
          <p>
            {mediaType === "MOVIE" ? "Trending Movies" : "Trending Tv Shows"}
          </p>
          <Popover>
            <PopoverTrigger
              render={
                <Button variant="ghost">
                  <ChevronDown className="translate-y-0.5" />
                </Button>
              }
            ></PopoverTrigger>
            <PopoverContent
              className="w-fit items-start gap-2"
              align="end"
              sideOffset={8}
            >
              {["MOVIE", "TV_SHOW"].map((i, index) => (
                <>
                  {i === mediaType ? (
                    <Link
                      className="p-0 h-fit text-primary hover:text-primary"
                      key={index}
                      to={`/trending/${i === "MOVIE" ? "movie" : "tv"}`}
                    >
                      {i === "MOVIE" ? "Trending Movies" : "Trending Tv Shows"}
                    </Link>
                  ) : (
                    <Link
                      className=" p-0 h-fit"
                      key={index}
                      to={`/trending/${i === "MOVIE" ? "movie" : "tv"}`}
                    >
                      {i === "MOVIE" ? "Trending Movies" : "Trending Tv Shows"}
                    </Link>
                  )}
                </>
              ))}
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <QueryWrapper
        query={query}
        isEmpty={!query.data?.pages.flat().length}
        loadingPlaceHolder={
          <div className="grid grid-cols-[repeat(auto-fit,minmax(100px,240px))] gap-2">
            {Array(12)
              .fill(null)
              .map((x, i) => (
                <Skeleton key={i} className="h-100 w-full aspect-2/3" />
              ))}
          </div>
        }
      >
        <div className="grid grid-cols-[repeat(auto-fit,minmax(100px,240px))] gap-2">
          {query.data?.pages.flat().map((s, i) => (
            <Link
              to={`/show/${mediaType === "MOVIE" ? "movie" : "tv"}/${s.tmdbId}`}
              key={i}
              className="hover:ring ring-primary"
            >
              <ShowCard show={s} variant="compact" />
            </Link>
          ))}
        </div>
      </QueryWrapper>
    </div>
  );
}
