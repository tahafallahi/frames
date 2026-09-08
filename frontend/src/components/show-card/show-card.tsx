import Details from "./details";
import { Button } from "../ui/button";
import { capitilize } from "@/utils/general";
import { MediaType, type ApiSearchShow, type Show } from "@/types/show";
import { Link } from "react-router";

export default function ShowCard({
  show,
  variant,
}: {
  show: Show | ApiSearchShow;
  variant: "detailed" | "detailedOmitButtons" | "detailedOmitTitle" | "compact";
}) {
  if (variant === "detailed") {
    return (
      <div className="flex flex-col gap-3">
        <Link
          to={`/show/${show.mediaType === MediaType.MOVIE ? "movie" : "tv"}/${show.tmdbId}`}
        >
          <h6 className="text-2xl hover:text-primary">{show.title}</h6>
        </Link>
        <div className="px-5 py-3 flex flex-col gap-5 border-l">
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
          <Details show={show} />
          <div className="flex flex-col gap-1">
            <Button className="h-13 font-bold">
              Write About {capitilize(show.title)}
            </Button>
            <Button variant={"secondary"} className="h-13 font-bold">
              Add to Your Favorites
            </Button>
          </div>
        </div>
      </div>
    );
  } else if (variant === "detailedOmitButtons") {
    return (
      <div className="flex flex-col gap-3">
        <h6 className="text-2xl">{show.title}</h6>
        <div className="px-5 py-3 flex flex-col gap-5 border-l">
          <img
            src={
              show.posterPath
                ? `${import.meta.env.VITE_IMG_TMDB_URL}/w300/${show.posterPath}`
                : import.meta.env.VITE_MOVIE_PLACEHOLDER
            }
            alt={"Poster of " + show.title}
            className="w-full h-auto aspect-2/3"
          />
          <p>{show.overview}</p>
          <Details show={show} />
        </div>
      </div>
    );
  } else if (variant === "detailedOmitTitle") {
    return (
      <div className="px-5 py-3 flex flex-col gap-5 border-l">
        <img
          src={
            show.posterPath
              ? `${import.meta.env.VITE_IMG_TMDB_URL}/w300/${show.posterPath}`
              : import.meta.env.VITE_MOVIE_PLACEHOLDER
          }
          alt={"Poster of " + show.title}
          className="w-full h-auto aspect-2/3"
        />
        <Details show={show} />
        <Button className="h-13 font-bold">Add to Your Favorites</Button>
      </div>
    );
  } else if (variant === "compact") {
    return (
      <div className="relative bg-popover flex flex-col h-full">
        <img
          src={
            show.posterPath
              ? `${import.meta.env.VITE_IMG_TMDB_URL}/w300/${show.posterPath}`
              : import.meta.env.VITE_MOVIE_PLACEHOLDER
          }
          alt={"Poster of " + show.title}
          className="w-full h-auto aspect-2/3"
        />
        <div className="p-3 flex flex-col gap-3">
          <h6 className="text-xl font-bold">{show.title}</h6>
          <Details show={show} />
        </div>
      </div>
    );
  }
}
