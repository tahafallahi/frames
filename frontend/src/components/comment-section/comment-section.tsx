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
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col gap-3 w-175 ">
        <h5 className="text-xl font-bold">
          {commentsCount + newComments.length} Comments
        </h5>
        <CommentForm
          newComments={newComments}
          setNewComments={setNewComments}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          post={post}
        />
        
        <motion.div
          layout
          transition={{ duration: 0.1 }}
          className="flex flex-col gap-3"
        >
          {!!newComments.length &&
            newComments.map((c, i) => <Comment highlight comment={c} key={i}></Comment>)}

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
