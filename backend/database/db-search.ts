import { prisma } from "lib/prisma";

import type { Post } from "generated/prisma/client";

export async function searchUser(query: string, limit: number) {
  const users = await prisma.$queryRaw`
    SELECT id, username, "profilePath" FROM (
      SELECT id, username, "profilePath", similarity(username, ${query}) AS similarity
      FROM "User"
      WHERE username % ${query} OR username ILIKE ${"%" + query + "%"}
      ORDER BY similarity DESC
      LIMIT ${limit}
    )
  `;
  return users
}

export async function searchPost(query: string, limit: number) {
  const posts = await prisma.$queryRaw<(Post & { likes: number })[]>`
    SELECT "Post".id, "Post".title, "Show"."mediaType" AS "showMediaType", "Show".title AS "showTitle",
    (SELECT COUNT(*) FROM "Like" WHERE "Like"."postId" = "Post"."id") AS "likes"
    FROM (
      SELECT id, title, "showId", similarity(title, ${query}) AS similarity
      FROM "Post"
      WHERE title % ${query} OR title ILIKE ${"%" + query + "%"}
      ORDER BY similarity DESC
      LIMIT ${limit}
    ) as "Post"
    LEFT JOIN "Show" 
    ON "Post"."showId" = "Show"."id"
  `;

  const serlizedPosts = posts.map((p) => ({
    ...p,
    likes: Number(p.likes.toString()),
  }));

  return serlizedPosts;
}
