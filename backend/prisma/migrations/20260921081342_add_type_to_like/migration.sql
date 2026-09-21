/*
  Warnings:

  - Added the required column `type` to the `Like` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "LikeType" AS ENUM ('LIKE', 'DISLIKE');

-- AlterTable
ALTER TABLE "Like" ADD COLUMN     "type" "LikeType" NOT NULL;
