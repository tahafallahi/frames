import type { User as schemaUser } from "generated/prisma/client";

declare global {
  namespace Express {
    interface User {
      id: string;
      username?: string | null;
      email?: string | null;
      hashedPassword?: string | null;
      profilePath?: string | null;
      bio?: string | null;
      likesCount?: number | null;
      follwersCount?: number | null;
      followingsCount?: number | null;
      postsCount?: number | null;
      createdAt?: Date | null;
      updatedAt?: Date | null;
    }
  }
}

export {};
