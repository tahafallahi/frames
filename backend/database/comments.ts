import { NotFoundError } from "error/AppErrors";
import { prisma } from "lib/prisma";
import { buildCommentTree } from "services/comment-tree";
import { ReactionType } from "types/reaction";

export async function getComments(postId: string) {
  const result = await prisma.comment.findMany({
    select: {
      id: true,
      content: true,
      author: { select: { id: true, username: true, profilePath: true } },
      parentId: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          replies: true,
        },
      },
    },
    where: { postId: postId },
  });

  const commentIds = result.map((c) => c.id);

  const reactionCount = await prisma.like.groupBy({
    by: ["type", "commentId"],
    where: { commentId: { in: commentIds } },
    _count: true
  });

  const countsByComments = new Map<string, {likesCount: number}>()

  for (const rc of reactionCount) {
    const entry = countsByComments.get(rc.commentId!) ?? {likesCount: 0}
    if (rc.type === ReactionType.LIKE) entry.likesCount += rc._count
    if (rc.type === ReactionType.DISLIKE) entry.likesCount -= rc._count
    countsByComments.set(rc.commentId!, entry)
  }

  const comments = result.map(({ _count, ...rest }) => ({
    ...rest,
    repliesCount: _count.replies,
    likesCount: countsByComments.get(rest.id)?.likesCount ?? 0
  }));

  const commentsWithReplies = buildCommentTree(comments);

  return commentsWithReplies;
}

export async function createComment({
  content,
  userId,
  postId,
  parentId,
}: {
  content: string;
  userId: string;
  postId: string;
  parentId?: string;
}) {
  const result = await prisma.comment.create({
    data: { content, authorId: userId, postId, parentId },
    select: {
      id: true,
      content: true,
      author: { select: { id: true, username: true, profilePath: true } },
      parentId: true,
      createdAt: true,
      updatedAt: true,
    },
  });


  const comment = {
    ...result,
    repliesCount: 0,
    likesCount: 0,
  };

  return comment;
}
