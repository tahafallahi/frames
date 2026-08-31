import { thousandToK } from "@/utils/general";
import { MessageCircle, Share2Icon, ThumbsDown, ThumbsUp } from "lucide-react";
import { Badge } from "../ui/badge";

import type { Post } from "@/types/feed";
import { Link } from "react-router";

export default function PostCard({
  post,
  variant,
}: {
  post: Post;
  variant: "compact" | "full";
}) {
  if (variant === "compact") {
    return (
      <Link to={"/posts/" + post.id}>
        <div className="w-175 px-5 py-3 flex flex-col gap-3 border-t border-primary hover:bg-popover">
          <div className="flex justify-between text-muted-foreground text-sm">
            <p>
              {post.show.mediaType === "MOVIE" ? "Movie" : "TV Show"}:{" "}
              {post.show.title}
            </p>
            <div className="flex gap-8">
              <p>{post.show.releaseYear}</p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div>
              <h4 className="text-2xl font-bold line-clamp-2">{post.title}</h4>
              <p className="text-sm">@{post.author.username}</p>
            </div>
            <p className="text-muted-foreground line-clamp-3">{post.content}</p>
          </div>
          {post.picturePath ? (
            <div className="overflow-hidden max-h-100">
              <img src={post.picturePath} alt="" className="w-fill" />
            </div>
          ) : null}
          <div className="flex items-center justify-between text-muted-foreground">
            <div className="flex  gap-8">
              <div className="flex gap-2 content-center">
                <ThumbsUp className="text rotate-y-180 w-5 -translate-y-0.5" />
                <p>{thousandToK(post.likesCount)}</p>
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
              {post.tags.map((t) => (
                <Badge variant={"outline"}>{t.name}</Badge>
              ))}
            </div>
          </div>
        </div>
      </Link>
    );
  } else if (variant === "full") {
    return (
      <div className="bg-popover w-175 px-5 py-3 flex flex-col gap-8 border-l border-primary">
        <div className="flex flex-col gap-2">
          <div>
            <h4 className="text-2xl font-bold">{post.title}</h4>
            <p className="text-sm">@{post.author.username}</p>
          </div>
          <p className="text-muted-foreground">{post.content}</p>
        </div>
        {post.picturePath ? <img src={post.picturePath} alt="" /> : null}
        <div className="flex items-center justify-between text-muted-foreground">
          <div className="flex  gap-8">
            <div className="flex gap-2 content-center">
              <ThumbsUp className="text rotate-y-180 w-5 -translate-y-0.5" />
              <p>{thousandToK(post.likesCount)}</p>
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
            {post.tags.map((t) => (
              <Badge variant={"outline"}>{t.name}</Badge>
            ))}
          </div>
        </div>
      </div>
    );
  }
}
