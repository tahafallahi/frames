import { ChevronDown } from "lucide-react";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import type { Show } from "@/types/show";
import ShowCard from "../show-card/show-card";
import { Link } from "react-router";

export default function ShowsColumn({
  shows,
  mediaType,
  setMediaType,
}: {
  shows?: Show[];
  mediaType: "MOVIE" | "TV_SHOW";
  setMediaType: React.Dispatch<React.SetStateAction<"MOVIE" | "TV_SHOW">>;
}) {
  return (
    <div className="flex flex-col gap-4 w-250">
      <div className="flex justify-between text-2xl">
        <div className="flex items-center gap-2">
          <p>
            {mediaType === "MOVIE" ? "Trending Movies" : "Trending Tv Shows"}
          </p>
          <Popover>
            <PopoverTrigger
              render={<ChevronDown className="translate-y-0.5" />}
            ></PopoverTrigger>
            <PopoverContent
              className="w-fit items-start gap-2"
              align="end"
              sideOffset={8}
            >
              {["MOVIE", "TV_SHOW"].map((i) => (
                <>
                  {i === mediaType ? (
                    <Button
                      variant={"ghost"}
                      className="p-0 h-fit text-primary hover:text-primary"
                    >
                      {i === "MOVIE" ? "Trending Movies" : "Trending Tv Shows"}
                    </Button>
                  ) : (
                    <Button
                      variant={"ghost"}
                      className=" p-0 h-fit"
                      onClick={() => setMediaType(i)}
                    >
                      {i === "MOVIE" ? "Trending Movies" : "Trending Tv Shows"}
                    </Button>
                  )}
                </>
              ))}
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4 w-full">
        {shows?.map((s, i) => (
          <Link to={`/show/${mediaType === "MOVIE" ? "movie" : "tv"}/${s.tmdbId}`} key={i} >
            <ShowCard show={s} variant="compact"/>
          </Link>
        ))}
      </div>
    </div>
  );
}
