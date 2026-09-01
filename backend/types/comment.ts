import { Prisma } from "generated/prisma/client";

export type CommentWtihReplies = OutputComment & {
  replies: CommentWtihReplies[];
};

export type OutputComment = Prisma.CommentGetPayload<{
  select: typeof OutputCommentSelect;
}> & { repliesCount: number; likesCount: number };

const OutputCommentSelect = {
  id: true,
  content: true,
  author: { select: { username: true, profilePath: true } },
  parentId: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.CommentSelect;
