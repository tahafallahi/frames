import Details from "./details";
import { Button } from "../ui/button";
import { capitilize } from "@/utils/general";
import type { Show } from "@/types/show";

export default function ShowCard({
  show,
  variant,
}: {
  show: Show;
  variant: "detailed" | "compact";
}) {
  if (variant === "detailed") {
    return (
      <div className=" w-75 px-5 py-3 flex flex-col gap-5 border-l">
        <h6 className="text-2xl">{show.title}</h6>
        <img src={show.posterPath} alt={"Poster of " + show.title} />
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
    );
    // } else if (variant === "full2") {
    //   return (
    //     <div className=" w-75 px-5 py-3 flex flex-col gap-5 border-l">
    //       <img src={show.posterPath} alt={"Poster of " + show.title} />
    //       <Details show={show} />
    //     </div>
    //   );
  } else if (variant === "compact") {
    return (
      <div className="relative bg-popover w-75 flex flex-col">
        <h6 className="absolute top-5 left-5 text-3xl font-bold">
          {show.title}
        </h6>
        <img src={show.posterPath} alt={"Poster of " + show.title} />
        <div className="p-3 ">
          <Details show={show} />
        </div>
      </div>
    );
  }
}
