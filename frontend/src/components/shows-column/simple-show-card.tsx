import { MediaType, type Show } from "@/types/show";
import { capitilize, thousandToK } from "@/utils/general";
import { Link } from "react-router";

export default function SimpleShowCard({ show }: { show: Show }) {
  return (
    <div className="h-full flex flex-col bg-popover">
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
      <div className="flex flex-col gap-2 text-muted-foreground p-3">
        <p className="text-xl font-bold">{show.title}</p>
        <p>
          Genres:{" "}
          {show.genres.length > 0
            ? show.genres.map((g) => capitilize(g)).join(" - ")
            : "—"}
        </p>
        <p>Year: {show.releaseYear ?? "—"}</p>
        <p>
          Related Posts: {show.postsCount ? thousandToK(show.postsCount) : "0"}
        </p>
        <p>
          Favorites: {show.postsCount ? thousandToK(show.favouritesCount) : "0"}
        </p>
      </div>
    </div>
  );
}
