import type { Comment as CommentType } from "@/types/types";
import Comment from "./comment";
import type { ReactElement } from "react";

export default function CommentSection({
  comments,
}: {
  comments: CommentType[];
}) {
  return <div className="flex flex-col gap-3">{comments.map((c, i) => recursiveReplies(c, i))}</div>;
}

function recursiveReplies(comment: CommentType, key: number): ReactElement {
  if (comment.replies.length < 1)
    return (
        <Comment key={key} comment={comment} />
    );

  return (
    <>
    <Comment comment={comment} />
    <div className="pl-10 flex flex-col gap-3">
      {comment.replies.map((r, i) => recursiveReplies(r, i))}
    </div>
    </>
  );
}
