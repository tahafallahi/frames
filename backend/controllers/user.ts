import type { Request, Response } from "express";
import { prisma } from "lib/prisma";

export function getLoggedInUser(req: Request, res: Response) {
  if (!req.user) return res.status(401).end();
  return res.json(req.user);
}

export async function getUser(req: Request<{ userId: string }>, res: Response) {
  const { userId } = req.params;

  if (!userId)
    return res
      .json({ error: "userId url parameter was not provied" });

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
      following: true,
      _count: {
        select: {
          followers: true,
          following: true,
          likes: true,
          posts: true,
        },
      },
    },
    where: { id: userId },
  });

  if (!result) return res.json({})

  const { _count, ...rest } = result;

  const user: Express.User = {
    ...rest,
    followingsCount: _count.following,
    follwersCount: _count.followers,
    likesCount: _count.likes,
    postsCount: _count.posts,
  };

  return res.json(user)
}
