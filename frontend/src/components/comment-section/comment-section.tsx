import { AnimatePresence, motion } from "motion/react";

import { FieldGroup, Field, FieldLabel } from "../ui/field";
import Comment from "./comment";

import type { Comment as CommentType } from "@/types/comment";
import { useRef, useState, type ReactElement } from "react";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { useUser } from "@/contexts/user-context";
import { useForm } from "react-hook-form";
import type { Post } from "@/types/post";
import { toast } from "../ui/toast";

const MotionFieldLabel = motion.create(FieldLabel);

export default function CommentSection({
  comments,
  commentsCount,
  post,
}: {
  comments: CommentType[];
  commentsCount: number;
  post: Post;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [user] = useUser();

  const {
    register,
    handleSubmit,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm<{ content: string }>({defaultValues:{content: ""}});

  function handleCommentSubmit(data: object) {
    if (user) {
      const output = { ...data, userId: user.id, postId: post.id };
      console.log(output);
    } else {
      toast.add({ type: "error", description: "Log in first." });
    }
  }

  return (
    <>
      <div className="flex flex-col gap-3 w-175 ">
        <h5 className="text-xl font-bold">{commentsCount} Comments</h5>
        {user ? (
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
                    required: "Comment can't be empty.",
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
                    <Button
                      variant="destructive"
                      onClick={() => {
                        reset();
                        clearErrors();
                        setIsOpen(false);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">Comment</Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        ) : (
          <Textarea disabled>Login first to comment.</Textarea>
        )}
        <motion.div
          layout
          transition={{ duration: 0.1 }}
          className="flex flex-col gap-3"
        >
          {comments.map((c, i) => recursiveReplies(c, i))}
        </motion.div>
      </div>
    </>
  );
}

function recursiveReplies(comment: CommentType, key: number): ReactElement {
  if (comment.repliesCount < 1) return <Comment key={key} comment={comment} />;

  return (
    <div key={key}>
      <Comment comment={comment} />
      <div className="pl-10 flex flex-col gap-3">
        {comment.replies.map((r, i) => recursiveReplies(r, i))}
      </div>
    </div>
  );
}
