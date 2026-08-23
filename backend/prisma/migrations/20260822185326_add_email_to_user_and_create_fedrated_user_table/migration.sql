/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "post_title_tgram_idx";

-- DropIndex
DROP INDEX "user_username_tgram_idx";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "email" TEXT,
ALTER COLUMN "hashedPassword" DROP NOT NULL;

-- CreateTable
CREATE TABLE "FederatedUser" (
    "subject" INTEGER NOT NULL,
    "id" TEXT NOT NULL,
    "provider" TEXT NOT NULL,

    CONSTRAINT "FederatedUser_pkey" PRIMARY KEY ("subject")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
