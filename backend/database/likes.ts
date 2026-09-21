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
    if (existingReaction) throw new ResourceAlreadyExistsError("Like");

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
