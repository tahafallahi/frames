import { motion } from "motion/react";
import { ChevronDown } from "lucide-react";

import type { Post } from "@/types/post";
import {
  PopoverTrigger,
  Popover,
  PopoverContent,
  PopoverHeader,
} from "@/components/ui/popover";
import { capitilize } from "@/utils/general";
import { Button } from "../ui/button";
import type { UseQueryResult } from "@tanstack/react-query";
import QueryWrapper from "../query-wrapper/query-wrapper";
import PostCard from "../post-card/post-card";
import clsx from "clsx";

export default function PostsColumn({
  query,
  title,
  sort,
  setSort,
}: {
  query: UseQueryResult<Post[]>;
  title: string;
  sort: "TOP" | "HOT" | "NEW";
  setSort: React.Dispatch<React.SetStateAction<"TOP" | "HOT" | "NEW">>;
}) {
  return (
    <div className="flex flex-col gap-4 w-175">
      <div className="flex justify-between text-2xl">
        <div className="flex items-center gap-2">
          <p>{capitilize(sort.toLocaleLowerCase())}</p>
          <Popover>
            <PopoverTrigger
              render={<ChevronDown className="translate-y-0.5" />}
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
              {["Top", "Hot", "New"].map((i) => (
                <>
                  {i.toLowerCase() === sort.toLowerCase() ? (
                    <Button
                      variant={"ghost"}
                      className="p-0 h-fit text-primary hover:text-primary"
                    >
                      {i}
                    </Button>
                  ) : (
                    <Button
                      variant={"ghost"}
                      className=" p-0 h-fit"
                      onClick={() => setSort(i.toUpperCase())}
                    >
                      {i}
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
          <>
            {Array(5)
              .fill(null)
              .map((e, i) => (
                <Skeleton key={i} className="h-50" />
              ))}
          </>
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

function Skeleton({ className }: { className?: string }) {
  return (
    <motion.div
      className={clsx(
        className,
        "h-10 bg-linear-to-r from-white/23 via-white/17 to-white/23 rounded-[10px] bg-size-[200%_100%]",
      )}
      animate={{ backgroundPositionX: ["0%", "-200%"] }}
      transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
    ></motion.div>
  );
}
