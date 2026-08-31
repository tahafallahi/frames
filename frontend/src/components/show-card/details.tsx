import type { Show } from "@/types/types";
import { toCapital } from "@/utils/general";

export default function Details({ show }: { show: Show }) {
  return (
    <div className="flex flex-col gap-2 text-muted-foreground">
      <div className="flex flex-col gap-2">
        <p>Genres: {show.genres.map((g) => toCapital(g)).join(" - ")}</p>
        <p>Year: {show.releaseYear}</p>
      </div>
      <hr />
      <div className="flex flex-col gap-2">
        <p>Related Posts: 222</p>
        <p>Followed By: 10K users</p>
      </div>
    </div>
  );
}
