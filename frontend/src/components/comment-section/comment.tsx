import type { Comment } from "@/types/types";
import { thousandToK } from "@/utils/general";
import { MessageCircle, Share2Icon, ThumbsDown, ThumbsUp } from "lucide-react";

export default function Comment({ comment }: { comment: Comment }) {
  return (
    <div className="px-5 py-3 flex gap-5 border-l border-primary bg-popover" >
      <div className="shrink-0">
        <img
          src={comment.user.img}
          alt={"profile picture of " + comment.user.username}
          className="rounded-full"
        />
      </div>
      <div className="flex flex-col gap-5 text-muted-foreground">
        <div className="flex flex-col gap-2">
          <p className="font-bold">{comment.user.username}</p>
          <p>{comment.text}</p>
        </div>
        <div className="flex  gap-8">
          <div className="flex gap-2 content-center">
            <ThumbsUp className="text rotate-y-180 w-5 -translate-y-0.5" />
            <p>{thousandToK(comment.likes)}</p>
            <ThumbsDown className="rotate-y-180 w-5 translate-y-0.5" />
          </div>
          <div className="flex gap-2 ">
            <MessageCircle className="w-5" />
            <p>{thousandToK(comment.replies.length)}</p>
          </div>
          <div className="flex gap-2 ">
            <Share2Icon className="w-5" />
            <p>share</p>
          </div>
        </div>
      </div>
    </div>
  );
}
