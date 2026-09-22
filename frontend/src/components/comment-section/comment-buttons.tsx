import { MessageCircle, Reply, ThumbsDown, ThumbsUp } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { thousandToK } from "@/utils/general";
import type { Comment } from "@/types/comment";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  ReactionAction,
  ReactionType,
  type Reaction,
  type ReactionPayload,
} from "@/types/reaction";
import { api } from "@/lib/api";
import type { Post } from "@/types/post";
import { toast } from "../ui/toast";

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
  const reactionMutation = useMutation({
    mutationFn: async (data: ReactionPayload) =>
      await api.post(`posts/${post.id}/comments/${comment.id}/reaction`, data),

    onMutate: async (variables, context) => {
      await context.client.cancelQueries({
        queryKey: ["comment-like", post.id, comment.id],
      });

      const prevLike = context.client.getQueryData<Reaction>([
        "comment-like",
        post.id,
        comment.id,
      ]);

      const prevComments = context.client.getQueryData<Comment[]>([
        "comments",
        post.id,
      ]);

      const prevState = prevLike?.type;
      const newState = variables.type;

      let likesCountChange = 0;

      if (prevState) {
        if (prevState === ReactionType.LIKE) {
          if (newState === ReactionType.LIKE) {
            likesCountChange = 0;
          } else if (newState === ReactionType.DISLIKE) {
            likesCountChange = -2;
          }
        } else if (prevState === ReactionType.DISLIKE) {
          if (newState === ReactionType.DISLIKE) {
            likesCountChange = 0;
          } else if (newState === ReactionType.LIKE) {
            likesCountChange = 2;
          }
        }
      } else if (!prevState) {
        if (newState === ReactionType.LIKE) {
          likesCountChange = 1;
        } else if (newState === ReactionType.DISLIKE) {
          likesCountChange = -1;
        }
      }

      context.client.setQueryData(
        ["comments", post.id],
        (prev: Comment[]): Comment[] => {
          return prev.map((c) => {
            if (c.id === comment.id) {
              return { ...c, likesCount: c.likesCount + likesCountChange };
            } else {
              return c;
            }
          });
        },
      );

      context.client.setQueryData(
        ["comment-like", post.id, comment.id],
        () => ({
          type: newState,
        }),
      );

      return { prevLike, prevComments };
    },

    onError: (error, variables, onMutateResult, context) => {
      context.client.setQueryData(
        ["comment-like", post.id, comment.id],
        onMutateResult?.prevLike,
      );
      context.client.setQueryData(
        ["comments", post.id],
        onMutateResult?.prevComments,
      );
      toast.add({
        type: "error",
        description: "Something went wrong, please try again later.",
      });
    },

    onSettled: async (data, error, variables, onMutateResult, context) => {
      await context.client.invalidateQueries({
        queryKey: ["comment-like", post.id, comment.id],
      });
      await context.client.invalidateQueries({
        queryKey: ["comments", post.id],
      });
    },
  });

  const likeQuery = useQuery({
    queryKey: ["comment-like", post.id, comment.id],
    queryFn: async () =>
      (
        await api.get<Reaction>(
          `posts/${post.id}/comments/${comment.id}/reaction`,
        )
      ).data,
  });

  const reaction = likeQuery.data;

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
            likeQuery.data?.type === ReactionType.LIKE && "text-primary",
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
            likeQuery.data?.type === ReactionType.DISLIKE && "text-primary",
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
        <Reply className="w-5" />
        <Button
          variant="ghost"
          className={cn(
            "p-0 h-fit hover:text-primary",
            isOpen && "text-primary",
          )}
          onClick={() => setOpenReplyForm(comment)}
        >
          reply
        </Button>
      </div>
    </div>
  );
}
