import type { Post } from "@/types/user";
import { thousandToK} from "@/utils/general";
import { MessageCircle, Share2Icon, ThumbsDown, ThumbsUp } from "lucide-react";
import { Badge } from "../ui/badge";

export default function PostCard({ post }: { post: Post }) {
  return (
    <div className="w-175 px-5 py-3 flex flex-col gap-3 border-t border-primary">
      <div className="flex justify-between text-muted-foreground text-sm">
        <p>
          {post.show.type === "movie" ? "Movie" : "TV Show"}: {post.show.name}
        </p>
        <div className="flex gap-8">
          <p>{post.show.year}</p>
          <div className="flex">
            <p>IMDB: {post.show.score}/10</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div>
          <h4 className="text-2xl font-bold line-clamp-2">{post.title}</h4>
          <p className="text-sm">@{post.username}</p>
        </div>
        <p className="text-muted-foreground line-clamp-3">{post.text}</p>
      </div>
      {post.show.img ? <img src={post.show.img} alt="" /> : null}
      <div className="flex items-center justify-between text-muted-foreground">
        <div className="flex  gap-8">
          <div className="flex gap-2 content-center">
            <ThumbsUp className="text rotate-y-180 w-5 -translate-y-0.5" />
            <p>{thousandToK(post.likes)}</p>
            <ThumbsDown className="rotate-y-180 w-5 translate-y-0.5" />
          </div>
          <div className="flex gap-2 ">
            <MessageCircle className="w-5" />
            <p>{thousandToK(post.commentsCount)}</p>
          </div>
          <div className="flex gap-2 ">
            <Share2Icon className="w-5" />
            <p>share</p>
          </div>
        </div>
        <div className="flex content-center">
          <Badge variant={"outline"}>

          {post.tags}
          </Badge>
        </div>
      </div>
    </div>
  );
}
