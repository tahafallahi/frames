import type { Show } from "@/types/show";

export default function FavoriteShows({ shows }: { shows: Show[] }) {
  return (
    <div>
      <p>Favorites:</p>
      {shows.map((show, i) => (
        <div key={i}>
          <img
            src={
              show.posterPath
                ? `${import.meta.env.VITE_IMG_TMDB_URL}/w300/${show.posterPath}`
                : import.meta.env.VITE_MOVIE_PLACEHOLDER
            }
            alt={"Poster of " + show.title}
            className="w-full h-auto aspect-2/3"
          />
        </div>
      ))}
    </div>
  );
}
