import Details from "./details";
import { Button, buttonVariants } from "../ui/button";
import { MediaType, type Show } from "@/types/show";
import { Link } from "react-router";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { useUser } from "@/contexts/user-context";
import AddFavoriteButton from "./add-favorite-button";
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

  // function handleWritePost() {}

  return (
    <div className="flex flex-col gap-3">
      {title && (
        <Link
          to={`/show/${show.mediaType === MediaType.MOVIE ? "movie" : "tv"}/${show.tmdbId}`}
        >
          <h6 className="text-2xl hover:text-primary">{show.title}</h6>
        </Link>
      )}

      <div className="px-5 py-3 flex flex-col gap-3 border-l text-muted-foreground">
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
              <Link
                to="/create"
                className={cn(
                  buttonVariants({
                    variant: "default",
                    className: "min-h-13 font-bold min-w-0",
                  }),
                )}
              >
                Write About This{" "}
                {show.mediaType === MediaType.MOVIE ? "Movie" : "TV Show"}
              </Link>
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
  );
}
