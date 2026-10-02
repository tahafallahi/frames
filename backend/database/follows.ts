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

  return fRelation;
}

export async function unfollowUser(userId: string, followeeUserId: string) {
  const existingFRelation = await prisma.follows.findUnique({
    where: {
      followerId_followeeId: { followerId: userId, followeeId: followeeUserId },
    },
  });

  if (!existingFRelation) throw new NotFoundError("Follow relation");

  const fRelation = await prisma.follows.delete({
    where: {
      followerId_followeeId: { followerId: userId, followeeId: followeeUserId },
    },
  });

  return fRelation;
}

export async function getNewFollows(userId: string) {
  const newFollows = await prisma.follows.findMany({
    where: { AND: { followeeId: userId, notify: true } },
  });

  return newFollows;
}

export async function dismissEveryFollow(userId: string) {
  const result = await prisma.follows.updateManyAndReturn({
    data: { notify: false },
    where: { followeeId: userId },
  });

  console.log(result);

  return result;
}

export async function getFollowings(userId: string) {
  const FRelations = await prisma.follows.findMany({
    where: { followerId: userId },
    orderBy: { createdAt: "desc" },
  });


  const users = await Promise.all(
    FRelations.map(async (r) => {
      const user = await prisma.user.findUnique({
        where: { id: r.followeeId },
        select: { id: true, username: true, profilePath: true },
      });
      return user
    }),
  );

  return users
}
