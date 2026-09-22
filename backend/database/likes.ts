import { NotFoundError, ResourceAlreadyExistsError } from "error/AppErrors";
import { LikeType } from "generated/prisma/enums";
import { prisma } from "lib/prisma";
import { ReactionAction, ReactionType, type Reaction } from "types/reaction";

export async function updatePostReaction(
  userId: string,
  postId: string,
  reaction: Reaction,
) {
  if (reaction.action === ReactionAction.ADD) {
    const existingReaction = await prisma.like.findUnique({
      where: { userId_postId: { userId, postId } },
    });
    if (existingReaction) {
      if (existingReaction.type === reaction.type) {
        throw new ResourceAlreadyExistsError("Like");
      } else {
        await prisma.like.delete({
          where: { userId_postId: { userId, postId } },
        });
      }
    }

    const result = await prisma.like.create({
      data: { userId, postId, type: reaction.type },
    });

    return result;
  } else if (reaction.action === ReactionAction.REMOVE) {
    const result = await prisma.like.findUnique({
      where: { userId_postId: { userId, postId } },
    });

    if (!result || result.type != reaction.type)
      throw new NotFoundError("Reaction");

    await prisma.like.delete({
      where: { userId_postId: { userId, postId } },
    });

    return result;
  }
}

export async function getPostReaction(userId: string, postId: string) {
  const reaction = await prisma.like.findUnique({
    where: { userId_postId: { userId, postId } },
  });

  return reaction;
}

export async function updateCommentReaction(
  userId: string,
  commentId: string,
  reaction: Reaction,
) {
  if (reaction.action === ReactionAction.ADD) {
    const existingReaction = await prisma.like.findUnique({
      where: { userId_commentId: { userId, commentId } },
    });
    if (existingReaction) {
      if (existingReaction.type === reaction.type) {
        throw new ResourceAlreadyExistsError("Like");
      } else {
        await prisma.like.delete({
          where: { userId_commentId: { userId, commentId } },
        });
      }
    }

    const result = await prisma.like.create({
      data: { userId, commentId, type: reaction.type },
    });
    return result;
  } else if (reaction.action === ReactionAction.REMOVE) {
    const result = await prisma.like.findUnique({
      where: { userId_commentId: { userId, commentId } },
    });

    if (!result || result.type != reaction.type)
      throw new NotFoundError("Reaction");

    await prisma.like.delete({
      where: { userId_commentId: { userId, commentId } },
    });

    return result;
  }
}

export async function getCommentReaction(userId: string, commentId: string) {
  const reaction = await prisma.like.findUnique({
    where: { userId_commentId: { userId, commentId } },
  });

  return reaction;
}
