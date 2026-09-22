import { useState, type ReactElement } from "react";

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
  const [openReplyForm, setOpenReplyForm] = useState<CommentType | null>(null);

  return (
    <>
      <div className="flex flex-col gap-3 w-175 ">
        <h5 className="text-xl font-bold">{commentsCount} Comments</h5>
        <CommentForm
          newComments={newComments}
          setNewComments={setNewComments}
          isOpen={formIsOpen}
          setIsOpen={setFormIsOpen}
          post={post}
        />

        <div className="flex flex-col gap-3">
          {newComments.map((c, i) => (
            <Comment
              highlight
              comment={c}
              key={i}
              post={post}
              openReplyForm={openReplyForm}
              setOpenReplyForm={setOpenReplyForm}
            ></Comment>
          ))}

          {comments.map((c) =>
            recursiveReplies(c, post, openReplyForm, setOpenReplyForm),
          )}
        </div>
      </div>
    </>
  );
}

function recursiveReplies(
  comment: CommentType,
  post: Post,
  openReplyFrom: CommentType | null,
  setOpenReplyForm: React.Dispatch<React.SetStateAction<CommentType | null>>,
): ReactElement {
  if (comment.repliesCount < 1)
    return (
      <Comment
        key={comment.id}
        comment={comment}
        post={post}
        openReplyForm={openReplyFrom}
        setOpenReplyForm={setOpenReplyForm}
      />
    );

  return (
    <div key={comment.id} className="flex flex-col gap-3">
      <Comment
        comment={comment}
        post={post}
        openReplyForm={openReplyFrom}
        setOpenReplyForm={setOpenReplyForm}
      />
      <div className="pl-10 flex flex-col gap-3">
        {comment.replies.map((r) =>
          recursiveReplies(r, post, openReplyFrom, setOpenReplyForm),
        )}
      </div>
    </div>
  );
}
