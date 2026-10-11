import {
  Copy,
  MessageCircle,
  Share2Icon,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";

import { thousandToK } from "@/utils/general";
import telegramLogo from "../../assets/telegram-logo.svg";
import xLogo from "../../assets/x-logo.svg";

import type { Post } from "@/types/post";
import { Button } from "../ui/button";
import { useMutation } from "@tanstack/react-query";
import { cn } from "@/utils/cn";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Link, useNavigate } from "react-router";
import { useUser } from "@/contexts/user-context";

import {
  ReactionAction,
  ReactionType,
} from "@/types/reaction";
import { postReactionMutOpts } from "@/lib/mutationOptions";

interface Props {
  post: Post;
}

export default function PostButtons({ post }: Props) {
  const [user] = useUser();
  const navigate = useNavigate();
  const reaction = post.reaction;

  const reactionMutation = useMutation(postReactionMutOpts(post, reaction, navigate, user ?? undefined));

  return (
    <div className="flex  gap-8">
      <div className="flex gap-2 content-center">
        <Button
          onClick={() => {
            if (reaction.type !== ReactionType.LIKE) {
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
        <p>{thousandToK(post.likesCount)}</p>
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
      <div className="flex gap-2 ml-2">
        <Button variant="ghost" size="icon-xs" className="hover:text-primary">
          <MessageCircle className="size-full" />
        </Button>
        <p>{thousandToK(post.commentsCount)}</p>
      </div>
      <div className="flex gap-2 ">
        <Popover>
          <PopoverTrigger
            render={
              <Button variant="ghost" className="hover:text-primary h-fit p-0">
                <div className="flex gap-2 items-center">
                  <Share2Icon className="size-6" />
                  <p className="">share</p>
                </div>
              </Button>
            }
          ></PopoverTrigger>
          <PopoverContent align="start" className="w-fit">
            <div className="flex gap-4">
              <Button
                variant="ghost"
                size="icon-sm"
                className="hover:text-primary"
                onClick={async () =>
                  await navigator.clipboard.writeText(
                    `${import.meta.env.VITE_URL}/posts/${post.id}`,
                  )
                }
              >
                <Copy className="size-full" />
              </Button>
              <div className="bg-border w-px"></div>
              <Link
                to={`https://t.me/share/url/?url=${encodeURIComponent(`${import.meta.env.VITE_URL}/posts/${post.id}`)}&text=${encodeURIComponent(post.title)}`}
                target="_blank"
                className="hover:ring-2 ring-primary h-8"
              >
                <img src={telegramLogo} className="size-full" />
              </Link>
              <Link
                to={`https://x.com/intent/post?url=${encodeURIComponent(`${import.meta.env.VITE_URL}/posts/${post.id}`)}&text=${encodeURIComponent(post.title)}`}
                target="_blank"
                className="hover:ring-2 ring-primary h-8 bg-white p-0.5"
              >
                <img src={xLogo} className=" size-full" />
              </Link>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
