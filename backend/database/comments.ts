import { NotFoundError } from "error/AppErrors";
import { prisma } from "lib/prisma";
import { buildCommentTree } from "services/comment-tree";

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
          likes: true,
        },
      },
    },
    where: { postId: postId },
  });

  const comments = result.map(({ _count, ...rest }) => ({
    ...rest,
    repliesCount: _count.replies,
    likesCount: _count.likes,
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
      _count: {
        select: {
          replies: true,
          likes: true,
        },
      },
    },
  });

  const { _count, ...rest } = result;

  const comment = {
    ...rest,
    repliesCount: _count.replies,
    likesCount: _count.likes,
  };

  return comment;
}
