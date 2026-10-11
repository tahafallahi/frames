import { mutationOptions } from "@tanstack/react-query";
import { isAxiosError } from "axios";

import type { Comment } from "@/types/comment";
import { api } from "@/lib/api";
import { toast } from "../components/ui/toast";
import { commentsQueryOpts } from "@/lib/queryOptions";
import { replaceCommentBranch } from "@/utils/replace-comment-branch";

import {
  ReactionType,
  type Reaction,
  type ReactionPayload,
} from "@/types/reaction";
import type { Post } from "@/types/post";
import type { User } from "@/types/user";
import type { NavigateFunction } from "react-router";

export const commentReactionMutOpt = (
  post: Post,
  comment: Comment,
  reaction: Reaction,
  navigate: NavigateFunction,
  user?: User,
) =>
  mutationOptions({
    mutationKey: ["comments-reaction"],
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
          return replaceCommentBranch(prev, {
            ...comment,
            likesCount: comment.likesCount + score(action) - score(prevState),
            reaction: { type: action },
          });
        },
      );

      return { prevComments: prevComments ?? [] };
    },

    onError: async (error, _variables, onMutateResult, context) => {
      if (isAxiosError(error)) {
        if (error.status === 401) {
          await navigate("/login");
          toast.add({
            type: "error",
            description: "Log in first.",
          });
          return;
        } else if (error.status === 409) {
          return;
        }
      } else {
        context.client.setQueryData(
          commentsQueryOpts(user?.id, post.id).queryKey,
          onMutateResult?.prevComments,
        );
        toast.add({
          type: "error",
          description: "Something went wrong, please try again later.",
        });
      }

    },

    onSuccess: async (_data, _variables, onMutateResult, context) => {
      const updatedComment = (
        await api.get<Comment>(`/posts/${post.id}/comments/${comment.id}`)
      ).data;
      //Checking ConcurantMutationsCount makes sure it doesn't update the whole comment tree to a previous state
      //if another mutations is in process
      //This approach causes some reactions to not be in sync with server, which I think is okey in here
      const concurantMutationsCount = context.client.isMutating({
        mutationKey: ["comments-reaction"],
      });
      if (concurantMutationsCount <= 1) {
        context.client.setQueryData(
          commentsQueryOpts(user?.id, post.id).queryKey,
          replaceCommentBranch(onMutateResult?.prevComments, updatedComment),
        );
      }
    },
  });
