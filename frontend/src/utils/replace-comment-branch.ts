import type { Comment } from "@/types/comment";

export function replaceCommentBranch(comments: Comment[], newComment: Comment){
  const newComments: Comment[] = []
  for (const c of comments) {
    newComments.push(recursiveReplacement(c, newComment ))
  }
  return newComments
}


function recursiveReplacement(
  comment: Comment,
  newComment: Comment,
): Comment {
  const newReplies: Comment[] = []
  if (comment.replies.length > 0) {
    for (const c of comment.replies){
      newReplies.push(recursiveReplacement(c, newComment))
    }
  }

  return comment.id === newComment.id ?  {...newComment, replies: comment.replies}: comment;
}
