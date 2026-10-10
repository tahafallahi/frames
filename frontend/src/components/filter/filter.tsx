import type { Filter, SelectedFilters } from "@/types/filter";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import type { UseQueryResult } from "@tanstack/react-query";
import QueryWrapper from "../query-wrapper/query-wrapper";
import Skeleton from "../skeleton/skeleton";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function Filter({
  query,
  filters,
  selectedFilters,
  setSelectedFilters,
}: {
  query: UseQueryResult;
  filters: Filter[];
  selectedFilters: SelectedFilters;
  setSelectedFilters: React.Dispatch<React.SetStateAction<SelectedFilters>>;
}) {
  const [isShown, setIsShown] = useState(false);

  function handleClick(filter: string, tag: string) {
    if (selectedFilters[filter].includes(tag)) {
      setSelectedFilters({
        ...selectedFilters,
        [filter]: [...selectedFilters[filter].filter((sf) => sf != tag)],
      });
    } else {
      setSelectedFilters({
        ...selectedFilters,
        [filter]: [tag, ...selectedFilters[filter]],
      });
    }
  }

  return (
    <div className="flex flex-col gap-3 bg-popover p-2 mb-4 md:p-0  md:bg-background">
      <div className="flex items-center gap-2">
        <Button className="md:hidden" onClick={() => setIsShown(!isShown)}>
          {isShown ? (
            <>
              <ChevronUp className="size-4" /> Close
            </>
          ) : (
            <>
              <ChevronDown className="size-4" /> Filter
            </>
          )}
        </Button>
        <h5 className="text-xl md:text-2xl hidden md:block">Filter</h5>
      </div>
      <div
        className={cn(
          "flex md:flex-col gap-6 md:border-l py-3 px-5 md:block",
          !isShown && "hidden",
        )}
      >
        <QueryWrapper
          query={query}
          isEmpty={!filters.length}
          loadingPlaceHolder={
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-4">
                <Skeleton variant="line" className="w-[7ch]" />
                <Skeleton className="h-8" />
              </div>
              <div className="flex flex-col gap-4">
                <Skeleton variant="line" className="w-[7ch]" />
                <Skeleton className="h-50" />
              </div>
            </div>
          }
        >
          {filters.map((f, i) => (
            <div key={i} className="flex flex-col gap-2 mb-4">
              <h6 className="text-base">{f.title}:</h6>
              <div className="flex flex-wrap gap-2">
                {f.items.map((tag, i) => (
                  <Button
                    variant={"ghost"}
                    onClick={() => handleClick(f.title, tag)}
                    className="p-0 "
                    key={i}
                  >
                    <Badge
                      variant={
                        selectedFilters[f.title]?.includes(tag)
                          ? "default"
                          : "outline"
                      }
                      className="p-4 text-sm md:text-base rounded-full"
                    >
                      {tag}
                    </Badge>
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </QueryWrapper>
      </div>
    </div>
  );
}
