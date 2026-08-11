import { useRef, useState } from "react";

import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { mockSearchResult } from "@/testing/mocks/mocks";
import SlimCard from "@/components/slim-card/slim-card";
import Profile from "@/components/profile-card/profile";
import { MessageCircle, ThumbsUp } from "lucide-react";

export default function SearchBar() {
  const [open, setOpen] = useState(false);
  const inputRef = useRef(null);

  const result = mockSearchResult;

  return (
    <>
      <Input
        ref={inputRef}
        className="w-[700px] h-[44px] px-5 mx-10 border-primary rounded-full focus-visible:ring-ring"
        placeholder="Search"
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
      ></Input>

      <Popover open={open}>
        <PopoverContent
          className="w-[700px] p-5 ring-1"
          align="center"
          sideOffset={36}
          initialFocus={false}
          finalFocus={false}
          anchor={inputRef}
        >
          <PopoverHeader>
            <PopoverTitle className="text-sm text-muted-foreground">
              Search results for: xcsd
            </PopoverTitle>
            <hr className="my-1 border-border" />
          </PopoverHeader>
          <div className="w-full flex flex-col">
            <div className="w-full flex gap-5">
              <div className="flex-1">
                <h3 className="text-base text-foreground">Movies & TV Shows</h3>
                <div className="grid grid-cols-3 gap-2 py-3">
                  {result.shows.map((s, i) => (
                    <div key={i} className="bg-background">
                      <img src={s.img} alt={`Poster for the Show ${s.name}`} />
                      <p className="text-base text-center py-1">{s.name}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="w-60 flex flex-col gap-3">
                <h3 className="text-base text-foreground">Users</h3>
                <div className="flex flex-col gap-2">
                  {result.users.map((u, i) => (
                    <SlimCard  key={i}>
                      <Profile user={u} variant={"compact"} />
                    </SlimCard>
                  ))}
                </div>
              </div>
            </div>
            <hr className="my-3 border-border" />
            <div className="w-full flex flex-col gap-3">
              <h3 className="text-base text-foreground">Posts</h3>
              <div className="flex flex-col gap-2">
                {result.posts.map((p, i) => (
                  <SlimCard  key={i} className="flex" >
                    <div className="flex-1">
                      <p className="text-foreground text-xl ">{p.title}</p>
                      <p>
                        {p.show.type}: {p.show.name}
                      </p>
                    </div>
                    <div className="w-20">
                      <p className="flex gap-3 items-center text-sm">
                        <ThumbsUp className="w-4" />
                        {p.likes < 1000 ? p.likes : p.likes / 1000 + "k"}
                      </p>
                      <p className="flex gap-3 items-center text-sm">
                        <MessageCircle className="w-4" />
                        {p.commentsCount}
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
