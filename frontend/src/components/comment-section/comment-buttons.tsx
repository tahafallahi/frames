import { MessageCircle, Reply, ThumbsDown, ThumbsUp } from "lucide-react";

import { cn } from "@/utils/cn";
import { Button } from "../ui/button";
import { thousandToK } from "@/utils/general";
import { useMutation } from "@tanstack/react-query";
import {
  ReactionAction,
  ReactionType,
} from "@/types/reaction";
import { useUser } from "@/contexts/user-context";
import { useNavigate } from "react-router";

import type { Comment } from "@/types/comment";
import type { Post } from "@/types/post";
import { commentReactionMutOpt } from "@/lib/mutationOptions";

interface Props {
  post: Post;
  comment: Comment;
  isOpen: boolean;
  setOpenReplyForm: React.Dispatch<React.SetStateAction<Comment | null>>;
}

export default function CommentButtons({
  post,
  comment,
  isOpen,
  setOpenReplyForm,
}: Props) {
  const [user] = useUser();
  const reaction = comment.reaction;
  const navigate = useNavigate();

  const reactionMutation = useMutation(commentReactionMutOpt(post, comment, reaction, navigate, user ?? undefined));

  return (
    <div className="flex  gap-8">
      <div className="flex gap-2 content-center">
        <Button
          onClick={() => {
            if (reaction?.type !== ReactionType.LIKE) {
              reactionMutation.mutate({
                type: ReactionType.LIKE,
                action: ReactionAction.ADD,
              });
            } else if (reaction.type === ReactionType.LIKE) {
              reactionMutation.mutate({
                type: ReactionType.LIKE,
                action: ReactionAction.REMOVE,
              });
            }
          }}
          variant="ghost"
          size="icon-xs"
          className={cn(
            reaction.type === ReactionType.LIKE && "text-primary",
            "hover:text-primary",
          )}
        >
          <ThumbsUp className="rotate-y-180 -translate-y-0.5 size-full" />
        </Button>
        <p>{thousandToK(comment.likesCount)}</p>
        <Button
          onClick={() => {
            if (reaction?.type !== ReactionType.DISLIKE) {
              reactionMutation.mutate({
                type: ReactionType.DISLIKE,
                action: ReactionAction.ADD,
              });
            } else if (reaction.type === ReactionType.DISLIKE) {
              reactionMutation.mutate({
                type: ReactionType.DISLIKE,
                action: ReactionAction.REMOVE,
              });
            }
          }}
          variant="ghost"
          size="icon-xs"
          className={cn(
            reaction.type === ReactionType.DISLIKE && "text-primary",
            "hover:text-primary",
          )}
        >
          <ThumbsDown className="rotate-y-180 translate-y-1 size-full" />
        </Button>
      </div>
      <div className="flex gap-2 ">
        <MessageCircle className="w-5" />
        <p>{thousandToK(comment.repliesCount)}</p>
      </div>
      <div className="flex gap-2 items-center">
        <Button
          variant="ghost"
          className={cn(
            "p-0 h-fit hover:text-primary",
            isOpen && "text-primary",
          )}
          onClick={() => {
            setOpenReplyForm(isOpen ? null : comment);
          }}
        >
            <Reply className="w-5" />
          <p className="hidden md:block">reply</p>
        </Button>
      </div>
    </div>
  );
}
