import { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ThumbsUp } from "lucide-react";

import { api } from "@/lib/api";
import { thousandToK } from "@/utils/general";

import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

import SlimCard from "@/components/slim-card/slim-card";
import Profile from "@/components/profile-card/profile-card";
import type { ApiSearchResponse } from "@/types/search";
import QueryWrapper from "@/components/query-wrapper/query-wrapper";

const DEBOUNCE_DELAY = 500;
const STALE_TIME = 1000 * 60;
const LIMIT = 3;

export default function SearchBar() {
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const timeoutId = useRef<number>(null);

  const { data, error, isLoading, isError } = useQuery({
    queryKey: ["searchResult", input],
    queryFn: () => getSearchResult(input, LIMIT),
    staleTime: STALE_TIME,
    enabled() {
      return input.length > 0
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
        className="w-175 h-11 px-5 mx-10 border-primary rounded-full focus-visible:ring-ring"
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
          <div className="w-full flex flex-col">
            <div className="w-full flex gap-5">
              <div className="flex-1">
                <h3 className="text-base text-foreground">Movies & TV Shows</h3>
                <QueryWrapper
                  queryData={{ data: data?.movies, error, isLoading, isError }}
                  emptyStateMessage={`There are no movies matching "${input}"`}
                >
                  <div className="grid grid-cols-3 gap-2 py-3">
                    {data?.movies.map((s, i) => (
                      <div key={i} className="bg-background">
                        <img
                          className="h-50"
                          src={
                            s.poster_path
                              ? "https://image.tmdb.org/t/p/w154/" +
                                s.poster_path
                              : import.meta.env.VITE_MOVIE_PLACEHOLDER
                          }
                          alt={s.title}
                        />
                        <div className="py-4">
                          <p className="text-sm text-center  line-clamp-2  ">
                            {s.title}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </QueryWrapper>
              </div>
              <div className="flex-1">
                <h3 className="text-base text-foreground">TV Shows</h3>
                <QueryWrapper
                  queryData={{ data: data?.tvs, error, isLoading, isError }}
                  emptyStateMessage={`There are no tv shows matching "${input}"`}
                >
                  <div className="grid grid-cols-3 gap-2 py-3">
                    {data?.tvs.map((s, i) => (
                      <div key={i} className="bg-background">
                        <img
                          className="h-50"
                          src={
                            s.poster_path
                              ? "https://image.tmdb.org/t/p/w154/" +
                                s.poster_path
                              : import.meta.env.VITE_TV_SHOW_PLACEHOLDER
                          }
                          alt={s.title}
                        />
                        <div className="py-4">
                          <p className="text-sm text-center  line-clamp-2  ">
                            {s.title}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </QueryWrapper>
              </div>
              <div className="w-60 flex flex-col gap-3">
                <h3 className="text-base text-foreground">Users</h3>
                <QueryWrapper
                  queryData={{ data: data?.users, error, isLoading, isError }}
                  emptyStateMessage={`There are no users matching "${input}"`}
                >
                  <div className="flex flex-col gap-2">
                    {data?.users.map((u, i) => (
                      <SlimCard key={i}>
                        <Profile user={u} variant={"compact"} />
                      </SlimCard>
                    ))}
                  </div>
                </QueryWrapper>
              </div>
            </div>
            <hr className="my-3 border-border" />
            <div className="w-full flex flex-col gap-3">
              <h3 className="text-base text-foreground">Posts</h3>
              <QueryWrapper
                queryData={{ data: data?.posts, error, isLoading, isError }}
                emptyStateMessage={`There are no posts matching "${input}"`}
              >
                <div className="flex flex-col gap-2">
                  {data?.posts.map((p, i) => (
                    <SlimCard key={i} className="flex">
                      <div className="flex-1">
                        <p className="text-foreground text-xl ">{p.title}</p>
                        <p>
                          {p.showMediaType === "MOVIE" ? "Movie" : "TV Show"}:{" "}
                          {p.showTitle}
                        </p>
                      </div>
                      <div className="w-20">
                        <p className="flex gap-3 items-center text-sm">
                          <ThumbsUp className="w-4" />
                          {thousandToK(p.likes)}
                        </p>
                      </div>
                    </SlimCard>
                  ))}
                </div>
              </QueryWrapper>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
}

async function getSearchResult(query: string, limit: number) {
  console.log("fired");
  const result = await api.get<ApiSearchResponse>(
    `/search?query=${query}&limit=${limit}`,
  );

  return result.data;
}
