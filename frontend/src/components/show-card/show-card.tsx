import Details from "./details";
import { Button } from "../ui/button";
import { MediaType, type Show } from "@/types/show";
import { Link } from "react-router";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { useUser } from "@/contexts/user-context";
import AddFavoriteButton from "./add-favorite-button";
import BarLink from "../bar-link/bar-link";
import { cn } from "@/lib/utils";

type ButtonKey = "favorite" | "writePost";

interface Props {
  show: Show;
  buttons?: ButtonKey[];
  title?: boolean;
  overview?: boolean;
}

export default function ShowCard({ show, buttons, overview, title }: Props) {
  const [fullOverviewExpanded, setFullOverviewExpanded] = useState(false);
  const [user, setUser] = useUser();
  const [isShown, setIsShown] = useState(false);

  return (
    <div className="flex flex-col gap-3 bg-popover md:bg-background mb-4 p-2 md:p-0">
      <div className="flex items-center gap-2 md:hidden">
        <Button className="md:hidden" onClick={() => setIsShown(!isShown)}>
          {isShown ? (
            <>
              <ChevronUp className="size-4" /> Close
            </>
          ) : (
            <>
              <ChevronDown className="size-4" /> {title && show.title}
            </>
          )}
        </Button>
      </div>
      <div className={cn("md:block", !isShown && "hidden",)}>
        {title && (
          <Link
            to={`/show/${show.mediaType === MediaType.MOVIE ? "movie" : "tv"}/${show.tmdbId}`}
          >
            <h6 className="text-2xl hover:text-primary">{show.title}</h6>
          </Link>
        )}

        <div className="px-5 py-3 flex flex-col gap-3 md:border-l text-muted-foreground">
          <Link
            to={`/show/${show.mediaType === MediaType.MOVIE ? "movie" : "tv"}/${show.tmdbId}`}
          >
            <img
              src={
                show.posterPath
                  ? `${import.meta.env.VITE_IMG_TMDB_URL}/w300/${show.posterPath}`
                  : import.meta.env.VITE_MOVIE_PLACEHOLDER
              }
              alt={"Poster of " + show.title}
              className="w-full h-auto aspect-2/3"
            />
          </Link>
          {overview && (
            <>
              <div className="flex flex-col gap-1">
                <p className={fullOverviewExpanded ? "" : "line-clamp-3"}>
                  {show.overview}
                </p>
                <Button
                  className="flex self-end text-secondary gap-1 items-center p-0"
                  variant="ghost"
                  onClick={() => setFullOverviewExpanded(!fullOverviewExpanded)}
                >
                  {fullOverviewExpanded ? (
                    <>
                      <p>Less</p>
                      <ChevronUp className="size-5 translate-y-0.5" />
                    </>
                  ) : (
                    <>
                      <p> More</p>
                      <ChevronDown className="size-5 translate-y-0.5" />
                    </>
                  )}
                </Button>
              </div>
              <hr />
            </>
          )}
          <Details show={show} />
          {buttons && (
            <div className="flex flex-col gap-1">
              {buttons?.includes("writePost") && (
                <BarLink
                  to={`/create?showId=${show.tmdbId}&type=${show.mediaType === MediaType.MOVIE ? "movie" : "tv"}`}
                >
                  Write About This{" "}
                  {show.mediaType === MediaType.MOVIE ? "Movie" : "TV Show"}
                </BarLink>
              )}
              {user && buttons?.includes("favorite") && (
                <AddFavoriteButton
                  user={user}
                  setUser={setUser}
                  show={show}
                  variant={
                    buttons?.includes("writePost") ? "secondary" : "default"
                  }
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
