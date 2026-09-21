import { NotFoundError, ResourceAlreadyExistsError } from "error/AppErrors";
import { LikeType } from "generated/prisma/enums";
import { prisma } from "lib/prisma";

export async function addLikeToPost(userId: string, postId: string) {
  const existingLike = await prisma.like.findUnique({
    where: { userId_postId: { userId, postId } },
  });
  if (existingLike) throw new ResourceAlreadyExistsError("Like");

  const like = await prisma.like.create({
    data: { userId, postId, type: LikeType.LIKE },
  });

  return like;
}

export async function removeLikeFromPost(userId: string, postId: string) {
  const like = await prisma.like.findUnique({
    where: { userId_postId: { userId, postId } },
  });
  if (!like) throw new NotFoundError("Like");

  await prisma.like.delete({
    where: { userId_postId: { userId, postId } },
  });

  return like;
}

export async function getPostLike(userId: string, postId: string) {
  const like = await prisma.like.findUnique({
    where: { userId_postId: { userId, postId } },
  });

  return like;
}
