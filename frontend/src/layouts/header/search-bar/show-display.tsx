import { MediaType, type ApiSearchShow } from "@/types/show";
import { Link } from "react-router";

interface Props {
  shows: ApiSearchShow[] | undefined;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ShowDisplay({ shows, setOpen }: Props) {
  return (
    <div className="grid grid-cols-3 gap-2 py-3">
      {shows?.map((show, i) => (
        <Link
          to={`/show/${show.mediaType === MediaType.MOVIE ? "movie": "tv"}/${show.tmdbId}`}
          onClick={() => setOpen(false)}
          key={i}
        >
          <div className="bg-background hover:ring-2 ring-primary">
            <img
              className="w-full h-auto aspect-2/3"
              src={
                show.posterPath
                  ? "https://image.tmdb.org/t/p/w154/" + show.posterPath
                  : show.mediaType === MediaType.MOVIE
                    ? import.meta.env.VITE_MOVIE_PLACEHOLDER
                    : import.meta.env.VITE_TV_SHOW_PLACEHOLDER
              }
              alt={show.title}
            />
            <div className="py-4">
              <p className="text-sm text-center  line-clamp-2  ">
                {show.title}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
