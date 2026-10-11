import { Link } from "react-router";

import { cn } from "@/utils/cn";
import CommentForm from "./comment-form";

import type { Comment } from "@/types/comment";
import type { Post } from "@/types/post";
import CommentButtons from "./comment-buttons";

interface Props {
  comment: Comment;
  post: Post;
  highlight?: boolean;
  openReplyForm: Comment | null;
  setOpenReplyForm: React.Dispatch<React.SetStateAction<Comment | null>>;
  newComments: Comment[];
  setNewComments: React.Dispatch<React.SetStateAction<Comment[]>>;
}

export default function Comment({
  comment,
  post,
  highlight,
  openReplyForm,
  setOpenReplyForm,
  newComments,
  setNewComments,
}: Props) {
  const isOpen = openReplyForm?.id === comment.id;

  function setIsOpen(open: boolean) {
    if (open) setOpenReplyForm(comment);
    if (!open) setOpenReplyForm(null);
  }

  return (
    <>
      <div
        className={cn(
          "px-5 py-3 flex gap-5 border-l border-primary bg-popover",
          highlight && "border",
        )}
      >
        <div className="shrink-0">
          <img
            src={
              comment.author.profilePath ??
              import.meta.env.VITE_PROFILE_PLACEHOLDER
            }
            alt={"profile picture of " + comment.author.username}
            className="rounded-full w-8"
          />
        </div>
        <div className="flex flex-col gap-5 text-muted-foreground">
          <div className="flex flex-col gap-2">
            <Link to={`/profile/${comment.author.id}`}>
              <p className="font-bold hover:text-primary">
                {comment.author.username}
              </p>
            </Link>
            <p>{comment.content}</p>
          </div>
          <CommentButtons
            post={post}
            comment={comment}
            setOpenReplyForm={setOpenReplyForm}
            isOpen={isOpen}
          />
        </div>
      </div>
      {isOpen && (
        <CommentForm
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          newComments={newComments}
          setNewComments={setNewComments}
          post={post}
          parentComment={comment}
          noAnimate
        />
      )}
    </>
  );
}
