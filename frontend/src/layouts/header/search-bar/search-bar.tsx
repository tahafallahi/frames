import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
} from "@/components/ui/popover";
import QueryWrapper from "@/components/query-wrapper/query-wrapper";
import ShowDisplay from "./show-display";
import UserDisplay from "./user-display";
import PostDisplay from "./post-display";

import type { ApiSearchResponse } from "@/types/search";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";

const DEBOUNCE_DELAY = 500;
const STALE_TIME = 1000 * 60;
const LIMIT = 3;

export default function SearchBar() {
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);
  const [phoneOpen, setPhoneOpen] = useState(false);
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
    }, DEBOUNCE_DELAY);
  }

  function handlePhoneInput(e: React.ChangeEvent<HTMLInputElement>) {
    if (timeoutId.current) clearTimeout(timeoutId.current);
    timeoutId.current = setTimeout(() => {
      setInput(e.target.value);
    }, DEBOUNCE_DELAY);
  }

  useEffect(() => {
    function handleClickOutside() {
      setOpen(false);
    }

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <>
      <Button
        onClick={() => setPhoneOpen(!phoneOpen)}
        variant="ghost"
        className="min-w-0 mx-2 px-3 md:hidden border-primary rounded-full shrink overflow-hidden flex gap-1"
      >
        <span className="truncate text-muted-foreground">Search</span>
        <SearchIcon />
      </Button>
      <div className="md:hidden">
        <div
          className={cn(
            "hidden fixed top-18 bottom-0 p-10 left-0 right-0 z-10 dark:bg-black/40 bg-white/70 backdrop-blur-md overflow-y-auto overflow-x-clip ooverscroll-contain",
            phoneOpen && "flex flex-col gap-5",
          )}
        >
          <InputGroup className=" md:flex h-11 px-4 border-primary rounded-full max-w-200 md:ml-25  xl:ml-45 mr-25  dark:bg-background bg-background">
            <InputGroupInput
              ref={inputRef}
              autoComplete="off"
              placeholder="Search"
              onChange={handlePhoneInput}
            />
            <InputGroupAddon align="inline-end">
              <SearchIcon />
            </InputGroupAddon>
          </InputGroup>
          <QueryWrapper
            query={query}
            isEmpty={
              query.data
                ? !query.data.movies.length &&
                  !query.data.tvs.length &&
                  !query.data.posts.length &&
                  !query.data.users.length
                : false
            }
            emptyStateMessage={
              <div className="pb-10 pt-10 text-center text-muted-foreground">
                {`There was no result matching: "${input}"`}
              </div>
            }
            loadingPlaceHolder=""
          >
            <div className="w-full flex flex-col gap-5">
              <div className="flex-1">
                <h3 className="text-base text-foreground">Movies</h3>
                <ShowDisplay shows={query.data?.movies} setOpen={setOpen} />
              </div>
              <div className="flex-1">
                <h3 className="text-base text-foreground">TV Shows</h3>
                <ShowDisplay shows={query.data?.tvs} setOpen={setOpen} />
              </div>
              <hr className="border-border" />
              <div className="w-60 flex flex-col gap-2">
                <h3 className="text-base text-foreground">Users</h3>
                <UserDisplay users={query.data?.users} setOpen={setOpen} />
              </div>
              <div className="w-full flex flex-col gap-2">
                <h3 className="text-base text-foreground">Posts</h3>
                <PostDisplay posts={query.data?.posts} setOpen={setOpen} />
              </div>
            </div>
          </QueryWrapper>
        </div>
      </div>

      <InputGroup className="hidden md:flex h-11 px-4 border-primary rounded-full max-w-200 md:ml-25  xl:ml-35 mr-25  flex-1">
        <InputGroupInput
          ref={inputRef}
          autoComplete="off"
          placeholder="Search"
          onChange={handleInput}
          onClick={(e) => e.stopPropagation()}
          onFocus={() => input && setOpen(true)}
        />
        <InputGroupAddon align="inline-end">
          <SearchIcon />
        </InputGroupAddon>
      </InputGroup>
      <Popover open={open}>
        <PopoverContent
          className="w-100 md:w-190 xl:w-275 p-5 ring-1"
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
              query.data
                ? !query.data.movies.length &&
                  !query.data.tvs.length &&
                  !query.data.posts.length &&
                  !query.data.users.length
                : false
            }
            emptyStateMessage={
              <div className="pb-10 pt-10 text-center text-muted-foreground">
                {`There was no result matching: "${input}"`}
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
