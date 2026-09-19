import { AnimatePresence, motion } from "motion/react";

import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { FieldGroup, Field, FieldLabel } from "../ui/field";

import type { Post } from "@/types/post";
import type { Comment, CommentForm } from "@/types/comment";
import { useUser } from "@/contexts/user-context";
import { useMutation } from "@tanstack/react-query";
import { toast } from "../ui/toast";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { api } from "@/lib/api";

const MotionFieldLabel = motion.create(FieldLabel);

interface Props {
  post: Post;
  newComments: Comment[];
  setNewComments: React.Dispatch<React.SetStateAction<Comment[]>>;
}

export default function CommentForm({
  post,
  newComments,
  setNewComments,
}: Props) {
  const [user] = useUser();
  const [isOpen, setIsOpen] = useState(false);

  const {
    register,
    handleSubmit,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm<{ content: string }>({ defaultValues: { content: "" } });

  function closeAndResetComments() {
    reset();
    clearErrors();
    setIsOpen(false);
  }

  const commentMutation = useMutation({
    mutationFn: async (data: CommentForm) =>
      (await api.post<Comment>("/comments", data)).data,
    onSuccess: (data) => {
      setNewComments([data, ...newComments]);
      closeAndResetComments();
    },
  });

  function handleCommentSubmit(data: { content: string }) {
    if (user) {
      const output = { ...data, postId: post.id };
      commentMutation.mutate(output);
    } else {
      toast.add({ type: "error", description: "Log in first." });
    }
  }

  if (user) {
    return (
      <form
        className="flex flex-col gap-2"
        onSubmit={handleSubmit(handleCommentSubmit)}
      >
        <FieldGroup className="my-2 relative z-10">
          <Field className="relative bg-background">
            <MotionFieldLabel
              htmlFor="title"
              className="absolute top-0 max-w-fit text-sm text-muted-foreground px-2 bg-background"
              initial={{ x: 8, y: 14 }}
              animate={isOpen ? { x: 16, y: -12 } : { x: 8, y: 14 }}
            >
              Leave a comment
            </MotionFieldLabel>
            <Textarea
              {...register("content", {
                required: "Comment can't be empty",
                maxLength: {
                  value: 5000,
                  message: "Comment must 5000 characters or less",
                },
              })}
              className="py-4 "
              onFocus={() => setIsOpen(true)}
            />
          </Field>
        </FieldGroup>
        <AnimatePresence mode="popLayout">
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className={"z-0 "}
            >
              <p className="text-destructive">{errors.content?.message}</p>
              <div className="flex justify-end gap-4 ">
                <Button variant="destructive" onClick={closeAndResetComments}>
                  Cancel
                </Button>
                <Button type="submit">Comment</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    );
  } else {
    return <Textarea disabled>Login first to comment.</Textarea>;
  }
}
