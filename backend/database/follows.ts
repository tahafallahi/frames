import { NotFoundError, ResourceAlreadyExistsError } from "error/AppErrors";
import { prisma } from "lib/prisma";

export async function followUser(userId: string, followeeUserId: string) {
  const existingFRelation = await prisma.follows.findUnique({
    where: {
      followerId_followeeId: { followerId: userId, followeeId: followeeUserId },
    },
  });

  if (existingFRelation)
    throw new ResourceAlreadyExistsError("Follow relation");

  const fRelation = await prisma.follows.create({
    data: { followerId: userId, followeeId: followeeUserId },
  });

  return fRelation
}

export async function unfollowUser(userId: string, followeeUserId: string) {
  const existingFRelation = await prisma.follows.findUnique({
    where: {
      followerId_followeeId: { followerId: userId, followeeId: followeeUserId },
    },
  });

  if (!existingFRelation)
    throw new NotFoundError("Follow relation");

  const fRelation = await prisma.follows.delete({
    where: {
      followerId_followeeId: { followerId: userId, followeeId: followeeUserId },
    },
  });

  return fRelation
}
