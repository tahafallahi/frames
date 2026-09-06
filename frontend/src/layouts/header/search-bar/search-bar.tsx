import { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import QueryWrapper from "@/components/query-wrapper/query-wrapper";
import ShowDisplay from "./show-display";
import UserDisplay from "./user-display";
import PostDisplay from "./post-display";

import type { ApiSearchResponse } from "@/types/search";

const DEBOUNCE_DELAY = 500;
const STALE_TIME = 1000 * 60;
const LIMIT = 3;

export default function SearchBar() {
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const timeoutId = useRef<number>(null);

  const query = useQuery({
    queryKey: ["searchResult", input],
    queryFn: () => getSearchResult(input, LIMIT),
    staleTime: STALE_TIME,
    enabled() {
      return input.length > 0;
    },
  });

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.value) {
      setOpen(false);
    }

    if (timeoutId.current) clearTimeout(timeoutId.current);
    timeoutId.current = setTimeout(() => {
      setInput(e.target.value);
      if (e.target.value) setOpen(true);
      document.addEventListener("click", () => setOpen(false));
    }, DEBOUNCE_DELAY);
  }

  return (
    <>
      <Input
        ref={inputRef}
        className="h-11 px-5 border-primary rounded-full focus-visible:ring-ring"
        autoComplete="off"
        placeholder="Search"
        onChange={handleInput}
        onClick={(e) => e.stopPropagation()}
        onFocus={() => input && setOpen(true)}
      ></Input>

      <Popover open={open}>
        <PopoverContent
          className="w-275 p-5 ring-1"
          align="center"
          sideOffset={36}
          initialFocus={false}
          finalFocus={false}
          anchor={inputRef}
          onClick={(e) => e.stopPropagation()}
        >
          <PopoverHeader>
            <PopoverTitle className="text-sm text-muted-foreground">
              Search results for: {input}
            </PopoverTitle>
            <hr className="my-1 border-border" />
          </PopoverHeader>
          <QueryWrapper
            query={query}
            isEmpty={
              !query.data?.movies.length &&
              !query.data?.tvs.length &&
              !query.data?.posts.length &&
              !query.data?.users.length
            }
            emptyStateMessage={
              <div className="pb-10 pt-10 text-center text-muted-foreground">
                {"There were results found for" + input}
              </div>
            }
            loadingPlaceHolder={"Loading..."}
          >
            <div className="w-full flex flex-col">
              <div className="w-full flex gap-5">
                <div className="flex-1">
                  <h3 className="text-base text-foreground">Movies</h3>
                  <ShowDisplay shows={query.data?.movies} setOpen={setOpen} />
                </div>
                <div className="flex-1">
                  <h3 className="text-base text-foreground">TV Shows</h3>
                  <ShowDisplay shows={query.data?.tvs} setOpen={setOpen} />
                </div>
                <div className="w-60 flex flex-col gap-3">
                  <h3 className="text-base text-foreground">Users</h3>
                  <UserDisplay users={query.data?.users} setOpen={setOpen} />
                </div>
              </div>
              <hr className="my-3 border-border" />
              <div className="w-full flex flex-col gap-3">
                <h3 className="text-base text-foreground">Posts</h3>
                <PostDisplay posts={query.data?.posts} setOpen={setOpen} />
              </div>
            </div>
          </QueryWrapper>
        </PopoverContent>
      </Popover>
    </>
  );
}

async function getSearchResult(query: string, limit: number) {
  const result = await api.get<ApiSearchResponse>(
    `/search?query=${query}&limit=${limit}`,
  );

  return result.data;
}
