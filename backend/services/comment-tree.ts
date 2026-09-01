import type { CommentWtihReplies, OutputComment } from "types/comment";

export function buildCommentTree(inComments: OutputComment[]) {
  const comments: CommentWtihReplies[] = inComments.map((c) => ({
    ...c,
    replies: [],
  }));
  const commentsWithReplies: CommentWtihReplies[] = [];

  comments.forEach((c) => {
    const result = recursiveCommentTree(c, comments);
    if (result) commentsWithReplies.push(result);
  });

  return commentsWithReplies;
}

function recursiveCommentTree(
  comment: CommentWtihReplies,
  comments: CommentWtihReplies[],
) {
  if (comment.parentId) return null;

  comments.forEach((c) => {
    if (c.parentId == comment.id) {
      comment.replies.push(c);
    }
  });

  comment.replies.forEach((c) => {
    recursiveCommentTree(c, comments);
  });

  return comment;
}