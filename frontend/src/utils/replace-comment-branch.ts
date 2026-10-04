import type { Comment } from "@/types/comment";

export function replaceCommentBranch(comments: Comment[], updatedComment: Comment){
  const newComments: Comment[] = []
  for (const c of comments) {
    newComments.push(recursiveReplacement(c, updatedComment ))
  }
  return newComments
}


function recursiveReplacement(
  comment: Comment,
  updatedComment: Comment,
): Comment {
  const newReplies: Comment[] = []
  if (comment.replies.length > 0) {
    for (const c of comment.replies){
      newReplies.push(recursiveReplacement(c, updatedComment))
    }
  }

  return comment.id === updatedComment.id ?  {...updatedComment, replies: newReplies}: {...comment, replies: newReplies};
}
