import { useRef, useState, type ChangeEvent, type Dispatch, type SetStateAction } from "react";

import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import SlimCard from "@/components/slim-card/slim-card";
import Profile from "@/components/profile-card/profile-card";
import { MessageCircle, ThumbsUp } from "lucide-react";
import { api } from "@/lib/api";
import type { ApiSearchResponse } from "@/types/search";

function getSearchResult(query: string, limit: number, setResult: Dispatch<SetStateAction<ApiSearchResponse>>) {
  const result = api.get<ApiSearchResponse>(`/search?query=${query}&limit=${limit}`);
  result
    .then((response) => {setResult(response.data)})
    .catch((error) => console.log(error));
}

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [response, setResult] = useState<ApiSearchResponse | null>();
  const inputRef = useRef(null);
  const timeoutId = useRef<number>(null);
  const limit = 3;

  function handleInput(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.value) {
      setOpen(true);
    } else {
      setOpen(false);
    }
    setQuery(e.target.value);

    if (timeoutId.current) clearTimeout(timeoutId.current);
    timeoutId.current = setTimeout(
      getSearchResult,
      2000,
      query,
      limit,
      setResult,
    );
  }

  return (
    <>
      <Input
        ref={inputRef}
        className="w-175 h-11 px-5 mx-10 border-primary rounded-full focus-visible:ring-ring"
        placeholder="Search"
        onChange={handleInput}
        onFocus={() => {
          if (query) setOpen(true);
        }}
        onBlur={() => setOpen(false)}
      ></Input>

      <Popover open={open}>
        <PopoverContent
          className="w-175 p-5 ring-1"
          align="center"
          sideOffset={36}
          initialFocus={false}
          finalFocus={false}
          anchor={inputRef}
        >
          <PopoverHeader>
            <PopoverTitle className="text-sm text-muted-foreground">
              Search results for: {query}
            </PopoverTitle>
            <hr className="my-1 border-border" />
          </PopoverHeader>
          <div className="w-full flex flex-col">
            <div className="w-full flex gap-5">
              <div className="flex-1">
                <h3 className="text-base text-foreground">Movies & TV Shows</h3>
                <div className="grid grid-cols-3 gap-2 py-3">
                  {response?.movies.map((s, i) => (
                    <div key={i} className="bg-background">
                      <img src={s.poster_path} alt={`Poster for the Show ${s.title}`} />
                      <p className="text-base text-center py-1">{s.title}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="w-60 flex flex-col gap-3">
                <h3 className="text-base text-foreground">Users</h3>
                {/* <div className="flex flex-col gap-2">
                  {response?.users.map((u, i) => (
                    <SlimCard key={i}>
                      <Profile user={u} variant={"compact"} />
                    </SlimCard>
                  ))}
                </div> */}
              </div>
            </div>
            <hr className="my-3 border-border" />
            <div className="w-full flex flex-col gap-3">
              <h3 className="text-base text-foreground">Posts</h3>
              <div className="flex flex-col gap-2">
                {response?.posts.map((p, i) => (
                  <SlimCard key={i} className="flex">
                    <div className="flex-1">
                      <p className="text-foreground text-xl ">{p.title}</p>
                      <p>
                        {p.showMediaType}: {p.showTitle}
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
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
}
