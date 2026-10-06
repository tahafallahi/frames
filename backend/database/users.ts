import { NotFoundError } from "error/AppErrors";
import { LikeType } from "generated/prisma/enums";
import { prisma } from "lib/prisma";

export async function getUser(userId: string) {
  const result = await prisma.user.findUnique({
    select: {
      id: true,
      username: true,
      email: true,
      profilePath: true,
      bio: true,
      createdAt: true,
      updatedAt: true,
      favorites: true,
      followings: true,
      _count: {
        select: {
          followers: true,
          followings: true,
          posts: true,
        },
      },
    },
    where: { id: userId },
  });

  if (!result) throw new NotFoundError("User");

  const { _count, ...rest } = result;

  const likesCount = await prisma.like.count({
    where: {
      AND: {
        type: LikeType.LIKE,
        OR: [{ post: { authorId: userId } }, { comment: { authorId: userId } }],
      },
    },
  });

  const user: Express.User = {
    ...rest,
    followingsCount: _count.followings,
    follwersCount: _count.followers,
    likesCount: likesCount,
    postsCount: _count.posts,
  };

  return user;
}

export async function editProfile(userId: string, bio: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new NotFoundError("User");
  const updatedUser = await prisma.user.update({
    data: { bio },
    where: { id: userId },
  });
  return updatedUser
}
