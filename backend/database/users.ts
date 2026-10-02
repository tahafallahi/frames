import { NotFoundError } from "error/AppErrors";
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
          likes: true,
          posts: true,
        },
      },
    },
    where: { id: userId },
  });

  if (!result) throw new NotFoundError("User");

  const { _count, ...rest } = result;

  const user: Express.User = {
    ...rest,
    followingsCount: _count.followings,
    follwersCount: _count.followers,
    likesCount: _count.likes,
    postsCount: _count.posts,
  };

  return user;
}