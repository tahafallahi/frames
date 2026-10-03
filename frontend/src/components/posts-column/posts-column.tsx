import { ChevronDown } from "lucide-react";

import type { Post } from "@/types/post";
import {
  PopoverTrigger,
  Popover,
  PopoverContent,
  PopoverHeader,
} from "@/components/ui/popover";
import { Button } from "../ui/button";
import type { UseQueryResult } from "@tanstack/react-query";
import QueryWrapper from "../query-wrapper/query-wrapper";
import PostCard from "../post-card/post-card";
import Skeleton from "../skeleton/skeleton";
import { FeedSortDict, FeedSortEnum } from "@/types/contexts";

export default function PostsColumn({
  query,
  title,
  sort,
  setSort,
}: {
  query: UseQueryResult<Post[]>;
  title: string;
  sort: FeedSortEnum;
  setSort: React.Dispatch<React.SetStateAction<FeedSortEnum>>;
}) {
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
                      onClick={() =>
                        setSort(FeedSortEnum[item.key])
                      }
                    >
                      {item.label}
                    </Button>
                  )}
                </>
              ))}
            </PopoverContent>
          </Popover>
        </div>
        <div className="font-bold">{title}</div>
      </div>
      <QueryWrapper
        query={query}
        loadingPlaceHolder={
          <div className="flex flex-col gap-6">
            {Array(5)
              .fill(null)
              .map((e, i) => (
                <Skeleton key={i} className="h-50" />
              ))}
          </div>
        }
        isEmpty={!query.data?.length}
      >
        <div className="flex flex-col gap-12">
          {query.data?.map((p, i) => (
            <PostCard post={p} variant="compact" key={i} />
          ))}
        </div>
      </QueryWrapper>
    </div>
  );
}
