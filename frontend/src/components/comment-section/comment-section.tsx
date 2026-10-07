import { useState, type ReactElement } from "react";

import Comment from "./comment";
import CommentForm from "./comment-form";

import type { Post } from "@/types/post";
import type { Comment as CommentType } from "@/types/comment";
import type { UseQueryResult } from "@tanstack/react-query";
import QueryWrapper from "../query-wrapper/query-wrapper";
import Skeleton from "../skeleton/skeleton";

export default function CommentSection({
  query,
  commentsCount,
  post,
}: {
  query: UseQueryResult<CommentType[]>;
  commentsCount?: number;
  post?: Post;
}) {
  const [newComments, setNewComments] = useState<CommentType[]>([]);
  const [formIsOpen, setFormIsOpen] = useState(false);
  const [openReplyForm, setOpenReplyForm] = useState<CommentType | null>(null);
  const comments = query.data;

  return (
    <>
      <div className="flex flex-col gap-3 ">
        <QueryWrapper
          query={query}
          isEmpty={!!(comments && !Object.keys(comments).length)}
          loadingPlaceHolder={
            <div className="flex flex-col gap-4">
              {Array(6)
                .fill(null)
                .map((_, i) => (
                  <Skeleton key={i} />
                ))}
            </div>
          }
        >
          {post && (
            <>
              <h5 className="text-xl font-bold">
                {commentsCount ?? 0} Comments
              </h5>
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
                {comments?.map((c) =>
                  recursiveReplies(c, post, openReplyForm, setOpenReplyForm),
                )}
              </div>
            </>
          )}
        </QueryWrapper>
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
