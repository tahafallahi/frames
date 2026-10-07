import type { Show } from "@/types/show";
import { Link } from "react-router";

export default function FavoriteShows({ shows }: { shows: Show[] }) {
  return (
    <div>
      <p>Favorites:</p>
      <div className="grid grid-cols-3 md:grid-cols-2 gap-2">
      {shows.map((show, i) => (
        <Link to={`/show/${show.mediaType}/${show.id}/`} key={i} className="hover:ring ring-primary">
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
      ))}
      </div>
    </div>
  );
}
