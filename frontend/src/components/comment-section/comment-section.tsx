import type { Comment as CommentType } from "@/types/comment";
import Comment from "./comment";
import type { ReactElement } from "react";

export default function CommentSection({
  comments,
  commentsCount,
}: {
  comments: CommentType[];
  commentsCount: number;
}) {
  return (
    <>
      <div className="flex flex-col gap-3 w-175 ">
        <h5 className="text-xl font-bold">{commentsCount} Comments</h5>
        <div className="flex flex-col gap-3">
          {comments.map((c, i) => recursiveReplies(c, i))}
        </div>
      </div>
    </>
  );
}

function recursiveReplies(comment: CommentType, key: number): ReactElement {
  if (comment.repliesCount < 1) return <Comment key={key} comment={comment} />;

  return (
    <>
      <Comment comment={comment} />
      <div className="pl-10 flex flex-col gap-3">
        {comment.replies.map((r, i) => recursiveReplies(r, i))}
      </div>
    </>
  );
}
