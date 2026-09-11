/*
  Warnings:

  - You are about to drop the `Genre` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_GenreToShow` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_GenreToShow" DROP CONSTRAINT "_GenreToShow_A_fkey";

-- DropForeignKey
ALTER TABLE "_GenreToShow" DROP CONSTRAINT "_GenreToShow_B_fkey";

-- AlterTable
ALTER TABLE "Show" ADD COLUMN     "genres" TEXT[];

-- DropTable
DROP TABLE "Genre";

-- DropTable
DROP TABLE "_GenreToShow";
