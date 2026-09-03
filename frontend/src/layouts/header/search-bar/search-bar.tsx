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
import { MediaType } from "@/types/show";
import { Link } from "react-router";

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
                  query={query}
                  emptyStateMessage={`There are no movies matching "${input}"`}
                >
                  <div className="grid grid-cols-3 gap-2 py-3">
                    {query.data?.movies.map((movie, i) => (
                      <Link to={"/show/movie/" + movie.tmdbId} onClick={() => setOpen(false)} key={i}>
                        <div
                          className="bg-background hover:ring-2 ring-primary"
                        >
                          <img
                            className="h-50"
                            src={
                              movie.posterPath
                                ? "https://image.tmdb.org/t/p/w154/" +
                                  movie.posterPath
                                : import.meta.env.VITE_MOVIE_PLACEHOLDER
                            }
                            alt={movie.title}
                          />
                          <div className="py-4">
                            <p className="text-sm text-center  line-clamp-2  ">
                              {movie.title}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </QueryWrapper>
              </div>
              <div className="flex-1">
                <h3 className="text-base text-foreground">TV Shows</h3>
                <QueryWrapper
                  query={query}
                  emptyStateMessage={`There are no tv shows matching "${input}"`}
                >
                  <div className="grid grid-cols-3 gap-2 py-3">
                    {query.data?.tvs.map((tv, i) => (
                      <Link to={"/show/tv/" + tv.tmdbId} onClick={() => setOpen(false)} key={i}>
                        <div
                          className="bg-background hover:ring-2 ring-primary"
                        >
                          <img
                            className="h-50"
                            src={
                              tv.posterPath
                                ? "https://image.tmdb.org/t/p/w154/" +
                                  tv.posterPath
                                : import.meta.env.VITE_TV_SHOW_PLACEHOLDER
                            }
                            alt={tv.title}
                          />
                          <div className="py-4">
                            <p className="text-sm text-center  line-clamp-2  ">
                              {tv.title}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </QueryWrapper>
              </div>
              <div className="w-60 flex flex-col gap-3">
                <h3 className="text-base text-foreground">Users</h3>
                <QueryWrapper
                  query={query}
                  emptyStateMessage={`There are no users matching "${input}"`}
                >
                  <div className="flex flex-col gap-2">
                    {query.data?.users.map((u, i) => (
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
                query={query}
                emptyStateMessage={`There are no posts matching "${input}"`}
              >
                <div className="flex flex-col gap-2">
                  {query.data?.posts.map((p, i) => (
                    <SlimCard key={i} className="flex">
                      <div className="flex-1">
                        <p className="text-foreground text-xl ">{p.title}</p>
                        <p>
                          {p.showMediaType === MediaType.MOVIE
                            ? "Movie"
                            : "TV Show"}
                          : {p.showTitle}
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
