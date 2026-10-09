import { MessageCircle, Reply, ThumbsDown, ThumbsUp } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { thousandToK } from "@/utils/general";
import type { Comment } from "@/types/comment";
import { useMutation } from "@tanstack/react-query";
import {
  ReactionAction,
  ReactionType,
  type ReactionPayload,
} from "@/types/reaction";
import { api } from "@/lib/api";
import type { Post } from "@/types/post";
import { toast } from "../ui/toast";
import { commentsQueryOpts } from "@/lib/queryOptions";
import { useUser } from "@/contexts/user-context";
import { isAxiosError } from "axios";
import { useNavigate } from "react-router";
import { replaceCommentBranch } from "@/utils/replace-comment-branch";

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

  const reactionMutation = useMutation({
    mutationFn: async (data: ReactionPayload) =>
      await api.post(`posts/${post.id}/comments/${comment.id}/reaction`, data),

    onMutate: async (variables, context) => {
      await context.client.cancelQueries({
        queryKey: commentsQueryOpts(user?.id, post.id).queryKey,
      });

      const prevComments = context.client.getQueryData<Comment[]>(
        commentsQueryOpts(user?.id, post.id).queryKey,
      );

      const prevState = reaction?.type;
      const action = variables.type === prevState ? null : variables.type;

      const score = (t?: ReactionType | null) =>
        t === ReactionType.LIKE ? 1 : t === ReactionType.DISLIKE ? -1 : 0;

      context.client.setQueryData(
        commentsQueryOpts(user?.id, post.id).queryKey,
        (prev) => {
          if (!prev) return prev;
          return prev.map((c) => {
            if (c.id === comment.id) {
              return {
                ...c,
                likesCount: c.likesCount + score(action) - score(prevState),
                reaction: { type: action },
              };
            } else {
              return c;
            }
          });
        },
      );

      return { prevComments: prevComments ?? [] };
    },

    onError: async (error, _variables, onMutateResult, context) => {
      context.client.setQueryData(
        commentsQueryOpts(user?.id, post.id).queryKey,
        onMutateResult?.prevComments,
      );

      if (isAxiosError(error) && error.status === 401) {
        await navigate("/login");
        toast.add({
          type: "error",
          description: "Log in first.",
        });
        return;
      }

      toast.add({
        type: "error",
        description: "Something went wrong, please try again later.",
      });
    },

    onSuccess: async (_data, _variables, onMutateResult, context) => {
      const updatedComment = (
        await api.get<Comment>(`/posts/${post.id}/comments/${comment.id}`)
      ).data;
      context.client.setQueryData(
        commentsQueryOpts(user?.id, post.id).queryKey,
        replaceCommentBranch(onMutateResult?.prevComments, updatedComment),
      );
    },
  });

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
