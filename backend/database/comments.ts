import { NotFoundError } from "../error/AppErrors.js";
import { LikeType } from "../generated/prisma/enums.js";
import { prisma } from "../lib/prisma.js";
import { buildCommentTree } from "../services/comment-tree.js";
import { ReactionType } from "../types/reaction.js";

export async function getComment(
  userId: string | undefined,
  commentId: string,
) {
  const [result, likesCount, dislikesCount] = await prisma.$transaction([
    prisma.comment.findUnique({
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
      where: { id: commentId },
    }),
    prisma.like.count({ where: { AND: { commentId, type: LikeType.LIKE } } }),
    prisma.like.count({
      where: { AND: { commentId, type: LikeType.DISLIKE } },
    }),
  ]);

  if (!result) throw new NotFoundError("Comment");

  const reaction = userId
    ? await prisma.like.findUnique({
        where: { userId_commentId: { userId, commentId } },
      })
    : null;

  const { _count, ...rest } = result;

  const comment = {
    ...rest,
    repliesCount: _count.replies,
    likesCount: likesCount - dislikesCount,
    reaction: { type: reaction?.type ?? null },
  };

  return comment;
}

export async function getComments(userId: string | undefined, postId: string) {
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
    _count: true,
  });

  const countsByComments = new Map<string, { likesCount: number }>();

  for (const rc of reactionCount) {
    const entry = countsByComments.get(rc.commentId!) ?? { likesCount: 0 };
    if (rc.type === ReactionType.LIKE) entry.likesCount += rc._count;
    if (rc.type === ReactionType.DISLIKE) entry.likesCount -= rc._count;
    countsByComments.set(rc.commentId!, entry);
  }

  const comments = await Promise.all(
    result.map(async (comment) => {
      const reaction = userId
        ? await prisma.like.findUnique({
            where: { userId_commentId: { userId, commentId: comment.id } },
          })
        : null;

      const { _count, ...rest } = comment;
      return {
        ...rest,
        repliesCount: _count.replies,
        likesCount: countsByComments.get(rest.id)?.likesCount ?? 0,
        reaction: { type: reaction?.type ?? null },
      };
    }),
  );

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
    reaction: {type: null}
  };

  return comment;
}
