import { useState, type ReactElement } from "react";
import { motion } from "motion/react";

import Comment from "./comment";
import CommentForm from "./comment-form";

import type { Post } from "@/types/post";
import type { Comment as CommentType } from "@/types/comment";

export default function CommentSection({
  comments,
  commentsCount,
  post,
}: {
  comments: CommentType[];
  commentsCount: number;
  post: Post;
}) {
  const [newComments, setNewComments] = useState<CommentType[]>([]);
  const [formIsOpen, setFormIsOpen] = useState(false);
  const [openReplyFrom, setOpenReplyForm] = useState<CommentType | null>(null);

  return (
    <>
      <div className="flex flex-col gap-3 w-175 ">
        <h5 className="text-xl font-bold">
          {commentsCount + newComments.length} Comments
        </h5>
        <CommentForm
          newComments={newComments}
          setNewComments={setNewComments}
          isOpen={formIsOpen}
          setIsOpen={setFormIsOpen}
          post={post}
        />

        <div
          className="flex flex-col gap-3"
        >
          {!!newComments.length &&
            newComments.map((c, i) => (
              <Comment
                highlight
                comment={c}
                key={i}
                post={post}
                openReplyForm={openReplyFrom}
                setOpenReplyForm={setOpenReplyForm}
              ></Comment>
            ))}

          {comments.map((c, i) =>
            recursiveReplies(c, i, post, openReplyFrom, setOpenReplyForm),
          )}
        </div>
      </div>
    </>
  );
}

function recursiveReplies(
  comment: CommentType,
  key: number,
  post: Post,
  openReplyFrom: CommentType | null,
  setOpenReplyForm: React.Dispatch<React.SetStateAction<CommentType | null>>,
): ReactElement {
  if (comment.repliesCount < 1)
    return (
      <Comment
        key={key}
        comment={comment}
        post={post}
        openReplyForm={openReplyFrom}
        setOpenReplyForm={setOpenReplyForm}
      />
    );

  return (
    <div key={key}>
      <Comment
        comment={comment}
        post={post}
        openReplyForm={openReplyFrom}
        setOpenReplyForm={setOpenReplyForm}
      />
      <div className="pl-10 flex flex-col gap-3">
        {comment.replies.map((r, i) =>
          recursiveReplies(r, i, post, openReplyFrom, setOpenReplyForm),
        )}
      </div>
    </div>
  );
}
