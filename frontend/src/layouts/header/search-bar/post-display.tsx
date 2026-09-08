import SlimCard from "@/components/slim-card/slim-card";
import type { ApiSearchPost } from "@/types/post";
import { MediaType } from "@/types/show";
import { thousandToK } from "@/utils/general";
import { ThumbsUp } from "lucide-react";
import { Link } from "react-router";

interface Props {
  posts: ApiSearchPost[] | undefined;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function PostDisplay({ posts, setOpen }: Props) {
  return (
    <div className="flex flex-col gap-2">
      {posts?.map((p, i) => (
        <Link to={`/posts/${p.id}`} key={i} onClick={() => setOpen(false)}>

        <SlimCard className="flex hover:ring-1 ring-primary">
          <div className="flex-1">
            <p className="text-foreground text-xl ">{p.title}</p>
            <p>
              {p.showMediaType === MediaType.MOVIE ? "Movie" : "TV Show"}:{" "}
              {p.showTitle}
            </p>
          </div>
          <div className="w-20">
            <p className="flex gap-3 items-center text-sm">
              <ThumbsUp className="w-4" />
              {thousandToK(p.likes)}
            </p>
          </div>
        </SlimCard>
        </ Link> 
      ))}
    </div>
  );
}
