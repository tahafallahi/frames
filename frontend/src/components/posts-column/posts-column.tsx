import { ChevronDown } from "lucide-react";

import {
  PopoverTrigger,
  Popover,
  PopoverContent,
  PopoverHeader,
} from "@/components/ui/popover";
import { Button } from "../ui/button";
import {
  useInfiniteQuery,
  type InfiniteData,
  type UseInfiniteQueryOptions,
} from "@tanstack/react-query";
import QueryWrapper from "../query-wrapper/query-wrapper";
import PostCard from "../post-card/post-card";
import Skeleton from "../skeleton/skeleton";
import { FeedSortDict, FeedSortEnum } from "@/types/contexts";
import type { Post } from "@/types/post";
import type { SelectedFilters } from "@/types/filter";
import { useEffect, useRef } from "react";

export default function PostsColumn({
  queryOptions,
  title,
  sort,
  setSort,
}: {
  queryOptions: UseInfiniteQueryOptions<
    Post[],
    Error,
    InfiniteData<Post[], unknown>,
    (
      | string
      | string[]
      | FeedSortEnum
      | number[]
      | SelectedFilters
      | undefined
    )[],
    number
  >;
  title?: string;
  sort: FeedSortEnum;
  setSort: React.Dispatch<React.SetStateAction<FeedSortEnum>>;
}) {
  const query = useInfiniteQuery(queryOptions);
  const loadMoreRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) void query.fetchNextPage();
        });
      },
      { rootMargin: "0px 0px 1500px 0px " },
    );

    observer.observe(loadMoreRef.current!);
  }, [query]);

  return (
    <div className="flex flex-col gap-4w">
      <div className="flex justify-between text-2xl">
        <div className="flex items-center gap-2">
          <p>{FeedSortDict[sort].label}</p>
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
              <PopoverHeader>
                Sort By:
                <hr className="my-1 border-border" />
              </PopoverHeader>
              {Object.values(FeedSortDict).map((item) => (
                <>
                  {item.key === sort.toString() ? (
                    <Button
                      variant={"ghost"}
                      className="p-0 h-fit text-primary hover:text-primary"
                    >
                      {item.label}
                    </Button>
                  ) : (
                    <Button
                      variant={"ghost"}
                      className=" p-0 h-fit"
                      onClick={() => setSort(FeedSortEnum[item.key])}
                    >
                      {item.label}
                    </Button>
                  )}
                </>
              ))}
            </PopoverContent>
          </Popover>
        </div>
        <div className="font-bold">
          {title ?? (query.data?.pages.flat().length ?? "") + " Posts"}
        </div>
      </div>
      <QueryWrapper
        query={query}
        loadingPlaceHolder={
          <div className="flex flex-col gap-6">
            {Array(5)
              .fill(null)
              .map((_, i) => (
                <Skeleton key={i} className="h-50" />
              ))}
          </div>
        }
        isEmpty={!query.data?.pages.flat().length}
      >
        <div className="flex flex-col gap-12">
          {query.data?.pages.flat().map((p, i) => (
            <PostCard post={p} variant="compact" key={i} />
          ))}
        </div>
      </QueryWrapper>
      <div ref={loadMoreRef}></div>
      {query.isFetchingNextPage && (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(100px,240px))] gap-2 mt-2">
          {Array(4)
            .fill(null)
            .map((_, i) => (
              <Skeleton key={i} className="h-auto w-full aspect-2/3" />
            ))}
        </div>
      )}
    </div>
  );
}
