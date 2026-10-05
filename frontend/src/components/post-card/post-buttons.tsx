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
import { api } from "@/lib/api";
import {
  ReactionAction,
  ReactionType,
  type ReactionPayload,
} from "@/types/reaction";
import { cn } from "@/lib/utils";
import { toast } from "../ui/toast";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Link, useNavigate } from "react-router";
import { postQueryOpts } from "@/lib/queryOptions";
import { useUser } from "@/contexts/user-context";
import { isAxiosError } from "axios";

interface Props {
  post: Post;
}

export default function PostButtons({ post }: Props) {
  const [user] = useUser();
  const navigate = useNavigate();
  const reaction = post.reaction

  const reactionMutation = useMutation({
    mutationFn: async (data: ReactionPayload) =>
      await api.post(`posts/${post.id}/reaction`, data),

    onMutate: async (variables, context) => {
      await context.client.cancelQueries({
        queryKey: postQueryOpts(user?.id, post.id).queryKey,
      });
      await context.client.cancelQueries({
        queryKey: ["user", user?.id, "posts"],
      });

      const prevPost = context.client.getQueryData(
        postQueryOpts(user?.id, post.id).queryKey,
      );
      const prevPostsQueries = context.client.getQueriesData({
        queryKey: ["user", user?.id, "posts"],
      });

      const prevState = reaction?.type;
      const action = variables.type === prevState ? null: variables.type;

      const score = (t?: ReactionType | null) => t === ReactionType.LIKE ? 1 : t === ReactionType.DISLIKE ? -1 : 0


      context.client.setQueryData(
        postQueryOpts(user?.id, post.id).queryKey,
        (prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            likesCount: prev.likesCount + score(action) - score(prevState),
            reaction: { type: action },
          };
        },
      );

      context.client.setQueriesData(
        { queryKey: ["user", user?.id, "posts"] },
        (prev: Post[]) =>
          prev.map((p: Post) => {
            if (p.id === post.id) {
              return {
                ...p,
                likesCount: p.likesCount + score(action) - score(prevState),
                reaction: { type: action },
              };
            } else {
              return p;
            }
          }),
      );

      return { prevPost, prevPostsQueries };
    },

    onError: async (error, _variables, onMutateResult, context) => {
      if (isAxiosError(error)) {
        if (error.status === 401) {
          await navigate("/login");
          toast.add({
            type: "error",
            description: "Log in first.",
          });
        } else if (error.status === 409) {
          return;
        }
      } else {
        context.client.setQueryData(
          postQueryOpts(user?.id, post.id).queryKey,
          onMutateResult?.prevPost,
        );

        onMutateResult?.prevPostsQueries.forEach(([key, value]) =>
          context.client.setQueryData(key, value),
        );
        toast.add({
          type: "error",
          description: "Something went wrong, please try again later.",
        });
      }
    },

    onSettled: async (_data, _error, _variables, _onMutateResult, context) => {
      const updatedPost = await context.client.fetchQuery({
        ...postQueryOpts(user?.id, post.id),
        staleTime: 0,
      });

      context.client.setQueriesData(
        { queryKey: ["user", user?.id, "posts"] },
        (prev: Post[]) =>
          prev.map((p: Post) => {
            if (p.id === updatedPost.id) {
              return updatedPost;
            } else {
              return p;
            }
          }),
      );
    },
  });

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
