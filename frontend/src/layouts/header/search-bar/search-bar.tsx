import { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import SlimCard from "@/components/slim-card/slim-card";
import Profile from "@/components/profile-card/profile-card";
import { ThumbsUp } from "lucide-react";
import { api } from "@/lib/api";
import type { ApiSearchResponse } from "@/types/search";

async function getSearchResult(query: string, limit: number) {
  console.log("fired");
  const result = await api.get<ApiSearchResponse>(`/search?query=${query}`);

  return result.data;
}

export default function SearchBar() {
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const timeoutId = useRef<number>(null);
  const limit = 3;

  console.log(input);

  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["searchResult", input],
    queryFn: () => getSearchResult(input, limit),
    staleTime: 1000 * 60,
  });

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.value) {
      setOpen(true);
    } else {
      setOpen(false);
    }

    if (timeoutId.current) clearTimeout(timeoutId.current);
    timeoutId.current = setTimeout(() => setInput(e.target.value), 500);
  }

  // complet search bar
  // move debvaouce time to config.ts
  // consider diffrent buggs and edge caes for search bar
  // implement diffrent state, pending, error and done

  // All that needs attentions has been give attention. The work is done.

  return (
    <>
      <Input
        ref={inputRef}
        className="w-175 h-11 px-5 mx-10 border-primary rounded-full focus-visible:ring-ring"
        placeholder="Search"
        onChange={handleInput}
        onFocus={() => {
          if (input) setOpen(true);
        }}
        onBlur={() => {
          setOpen(false);
        }}
      ></Input>

      <Popover open={open}>
        <PopoverContent
          className="w-275 p-5 ring-1"
          align="center"
          sideOffset={36}
          initialFocus={false}
          finalFocus={false}
          anchor={inputRef}
          onMouseDown={(e) => e.preventDefault()}
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
                {isError && `Something went wrong: ${error}`}
                {isLoading && "Loading..."}
                {data ? (
                  data.movies.length > 1 ? (
                    <div className="grid grid-cols-3 gap-2 py-3">
                      {data.movies.map((s, i) => (
                        <div key={i} className="bg-background">
                          <img
                          className="w-50"
                            src={
                              s.poster_path
                                ? "https://image.tmdb.org/t/p/w154/" +
                                  s.poster_path
                                : import.meta.env.VITE_MOVIE_PLACEHOLDER
                            }
                            alt={s.title}
                          />
                          <p className="text-sm text-center py-4">{s.title}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    `There was no movies matching ${input}`
                  )
                ) : null}
              </div>
              <div className="flex-1">
                <h3 className="text-base text-foreground">TV Shows</h3>
                {isError && `Something went wrong: ${error}`}
                {isLoading && "Loading..."}
                {data ? (
                  data.tvs.length > 1 ? (
                    <div className="grid grid-cols-3 gap-2 py-3">
                      {data.tvs.map((s, i) => (
                        <div key={i} className="bg-background">
                          <img className="w-50"
                            src={
                              s.poster_path
                                ? "https://image.tmdb.org/t/p/w154/" +
                                  s.poster_path
                                : import.meta.env.VITE_TV_SHOW_PLACEHOLDER
                            }
                            alt={s.title}
                          />
                          <p className="text-sm text-center py-4">{s.title}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    `There are no tv shows for ${input}`
                  )
                ) : null}
              </div>
              <div className="w-60 flex flex-col gap-3">
                <h3 className="text-base text-foreground">Users</h3>
                {isError && `Something went wrong: ${error}`}
                {isLoading && "Loading..."}
                {data ? (
                  data.users.length > 1 ? (
                    <div className="flex flex-col gap-2">
                      {data.users.map((u, i) => (
                        <SlimCard key={i}>
                          <Profile user={u} variant={"compact"} />
                        </SlimCard>
                      ))}
                    </div>
                  ) : (
                    `There are no users for ${input}`
                  )
                ) : null}
              </div>
            </div>
            <hr className="my-3 border-border" />
            <div className="w-full flex flex-col gap-3">
              <h3 className="text-base text-foreground">Posts</h3>
              {isError && `Something went wrong: ${error}`}
              {isLoading && "Loading..."}
              {data ? (
                data.posts.length > 1 ? (
                  <div className="flex flex-col gap-2">
                    {data.posts.map((p, i) => (
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
                            {p.likes < 1000 ? p.likes : p.likes / 1000 + "k"}
                          </p>
                        </div>
                      </SlimCard>
                    ))}
                  </div>
                ) : (
                  `There are no posts for ${input}`
                )
              ) : null}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
}
