import { MessageCircle, Share2Icon, ThumbsDown, ThumbsUp } from "lucide-react";

import { thousandToK } from "@/utils/general";

import type { Post } from "@/types/post";
import { Button } from "../ui/button";
import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import {
  ReactionAction,
  ReactionType,
  type Reaction,
  type ReactionPayload,
} from "@/types/reaction";
import { cn } from "@/lib/utils";
import { toast } from "../ui/toast";

interface Props {
  post: Post;
}

export default function PostButtons({ post }: Props) {
  const reactionMutation = useMutation({
    mutationFn: async (data: ReactionPayload) =>
      await api.post(`posts/${post.id}/reaction`, data),

    onMutate: async (variables, context) => {
      await context.client.cancelQueries({ queryKey: ["like", post.id] });
      await context.client.cancelQueries({ queryKey: ["post", post.id] });

      const prevLike = context.client.getQueryData<Reaction>(["like", post.id]);
      const prevPost = context.client.getQueryData(["post", post.id]);

      const wasReacted = !!prevLike?.type;

      context.client.setQueryData(["post", post.id], (prev: Post): Post => {
        return {
          ...prev,
          likesCount:
            variables.type === ReactionType.LIKE
              ? wasReacted
                ? prev.likesCount - 1
                : prev.likesCount + 1
              : wasReacted
                ? prev.likesCount + 1
                : prev.likesCount - 1,
        };
      });

      context.client.setQueryData(["like", post.id], () => ({
        type: wasReacted ? null : ReactionType.LIKE,
      }));

      return { prevLike, prevPost };
    },

    onError: (error, variables, onMutateResult, context) => {
      context.client.setQueryData(["like", post.id], onMutateResult?.prevLike);
      context.client.setQueryData(["post", post.id], onMutateResult?.prevPost);
      toast.add({
        type: "error",
        description: "Something went wrong, please try again later.",
      });
    },

    onSettled: async (data, error, variables, onMutateResult, context) => {
      await context.client.invalidateQueries({ queryKey: ["like", post.id] });
      await context.client.invalidateQueries({ queryKey: ["post", post.id] });
      await context.client.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const likeQuery = useQuery({
    queryKey: ["like", post.id],
    queryFn: async () =>
      (await api.get<Reaction>(`posts/${post.id}/reaction`)).data,
  });

  const reaction = likeQuery.data;

  return (
    <div className="flex  gap-8">
      <div className="flex gap-2 content-center">
        <Button
          onClick={() => {
            if (!reaction?.type) {
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
            likeQuery.data?.type === ReactionType.LIKE && "text-primary",
            "hover:text-primary",
          )}
        >
          <ThumbsUp className="rotate-y-180 -translate-y-0.5 size-full" />
        </Button>
        <p>{thousandToK(post.likesCount)}</p>
        <Button
          onClick={() => {
            if (!reaction?.type) {
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
            likeQuery.data?.type === ReactionType.DISLIKE && "text-primary",
            "hover:text-primary",
          )}
        >
          <ThumbsDown className="rotate-y-180 translate-y-1 size-full" />
        </Button>
      </div>
      <div className="flex gap-2 ">
        <Button variant="ghost" size="icon-xs" className="hover:text-primary">
          <MessageCircle className="size-full" />
        </Button>
        <p>{thousandToK(post.commentsCount)}</p>
      </div>
      <div className="flex gap-2 ">
        <Button variant="ghost" size="icon-xs" className="hover:text-primary">
          <Share2Icon className="size-full" />
        </Button>
        <p>share</p>
      </div>
    </div>
  );
}
