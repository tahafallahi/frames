import type { Show } from "@/types/show";

export default function FavoriteShows({ shows }: { shows: Show[] }) {
  return (
    <div>
      <p>Favorites:</p>
      {shows.map((show, i) => (
        <div key={i}>
          <img className="w-full" src={show.posterPath} alt={"Poster of" + show.title} />
        </div>
      ))}
    </div>
  );
}
