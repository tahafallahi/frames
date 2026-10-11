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
        {post && (
          <>
            <h5 className="text-xl font-bold">{commentsCount ?? 0} Comments</h5>
            <CommentForm
              newComments={newComments}
              setNewComments={setNewComments}
              isOpen={formIsOpen}
              setIsOpen={setFormIsOpen}
              post={post}
            />{" "}
          </>
        )}
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
              <div className="flex flex-col gap-3">
                {comments?.map((c) =>
                  recursiveReplies(
                    c,
                    post,
                    openReplyForm,
                    setOpenReplyForm,
                    newComments,
                    setNewComments,
                  ),
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
  newComments: CommentType[],
  setNewComments: React.Dispatch<React.SetStateAction<CommentType[]>>,
): ReactElement {
  if (comment.repliesCount < 1)
    return (
      <Comment
        highlight={newComments?.some((nc) => nc.id === comment.id)}
        key={comment.id}
        comment={comment}
        post={post}
        openReplyForm={openReplyFrom}
        setOpenReplyForm={setOpenReplyForm}
        newComments={newComments}
        setNewComments={setNewComments}
      />
    );

  return (
    <div key={comment.id} className="flex flex-col gap-3">
      <Comment
        highlight={newComments?.some((nc) => nc.id === comment.id)}
        comment={comment}
        post={post}
        openReplyForm={openReplyFrom}
        setOpenReplyForm={setOpenReplyForm}
        newComments={newComments}
        setNewComments={setNewComments}
      />
      <div className="pl-10 flex flex-col gap-3">
        {comment.replies.map((r) =>
          recursiveReplies(
            r,
            post,
            openReplyFrom,
            setOpenReplyForm,
            newComments,
            setNewComments
          ),
        )}
      </div>
    </div>
  );
}
