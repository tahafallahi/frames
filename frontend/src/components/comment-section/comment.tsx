import { cn } from "@/lib/utils";
import type { Comment } from "@/types/comment";
import { thousandToK } from "@/utils/general";
import { MessageCircle, Reply, ThumbsDown, ThumbsUp } from "lucide-react";
import { Link } from "react-router";

export default function Comment({ comment, highlight }: { comment: Comment, highlight?: boolean }) {
  return (
    <div className={cn("px-5 py-3 flex gap-5 border-l border-primary bg-popover", highlight && "border-1")} >
      <div className="shrink-0">
        <img
          src={comment.author.profilePath ?? import.meta.env.VITE_PROFILE_PLACEHOLDER}
          alt={"profile picture of " + comment.author.username}
          className="rounded-full w-8"
        />
      </div>
      <div className="flex flex-col gap-5 text-muted-foreground">
        <div className="flex flex-col gap-2">
          <Link to={`/profile/${comment.author.id}`} >
          <p className="font-bold hover:text-primary">{comment.author.username}</p>
          </Link>
          <p>{comment.content}</p>
        </div>
        <div className="flex  gap-8">
          <div className="flex gap-2 content-center">
            <ThumbsUp className="text rotate-y-180 w-5 -translate-y-0.5" />
            <p>{thousandToK(comment.likesCount)}</p>
            <ThumbsDown className="rotate-y-180 w-5 translate-y-0.5" />
          </div>
          <div className="flex gap-2 ">
            <MessageCircle className="w-5" />
            <p>{thousandToK(comment.repliesCount)}</p>
          </div>
          <div className="flex gap-2 ">
            <Reply className="w-5" />
            <p>reply</p>
          </div>
        </div>
      </div>
    </div>
  );
}
