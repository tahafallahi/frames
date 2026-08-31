import type { Show } from "@/types/show";
import { capitilize, thousandToK } from "@/utils/general";

export default function Details({ show }: { show: Show }) {
  return (
    <div className="flex flex-col gap-2 text-muted-foreground">
      <div className="flex flex-col gap-2">
        <p>Genres: {show.genres.length > 0 ? show.genres.map((g) => capitilize(g)).join(" - "): "—"}</p>
        <p>Year: {show.releaseYear ?? "—"}</p>
      </div>
      <hr />
      <div className="flex flex-col gap-2">
        <p>Related Posts: {thousandToK(show.postsCount)}</p>
        <p>Favorites: {thousandToK(show.favouritesCount)}</p>
      </div>
    </div>
  );
}
