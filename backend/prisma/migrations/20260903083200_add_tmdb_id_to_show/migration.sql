/*
  Warnings:

  - The primary key for the `Show` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `_GenreToShow` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `_ShowToUser` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `tmdbId` to the `Show` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_showId_fkey";

-- DropForeignKey
ALTER TABLE "Trending" DROP CONSTRAINT "Trending_showId_fkey";

-- DropForeignKey
ALTER TABLE "_GenreToShow" DROP CONSTRAINT "_GenreToShow_B_fkey";

-- DropForeignKey
ALTER TABLE "_ShowToUser" DROP CONSTRAINT "_ShowToUser_A_fkey";

-- AlterTable
ALTER TABLE "Post" ALTER COLUMN "showId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Show" DROP CONSTRAINT "Show_pkey",
ADD COLUMN     "tmdbId" INTEGER NOT NULL,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Show_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Trending" ALTER COLUMN "showId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "_GenreToShow" DROP CONSTRAINT "_GenreToShow_AB_pkey",
ALTER COLUMN "B" SET DATA TYPE TEXT,
ADD CONSTRAINT "_GenreToShow_AB_pkey" PRIMARY KEY ("A", "B");

-- AlterTable
ALTER TABLE "_ShowToUser" DROP CONSTRAINT "_ShowToUser_AB_pkey",
ALTER COLUMN "A" SET DATA TYPE TEXT,
ADD CONSTRAINT "_ShowToUser_AB_pkey" PRIMARY KEY ("A", "B");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_showId_fkey" FOREIGN KEY ("showId") REFERENCES "Show"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trending" ADD CONSTRAINT "Trending_showId_fkey" FOREIGN KEY ("showId") REFERENCES "Show"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ShowToUser" ADD CONSTRAINT "_ShowToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Show"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GenreToShow" ADD CONSTRAINT "_GenreToShow_B_fkey" FOREIGN KEY ("B") REFERENCES "Show"("id") ON DELETE CASCADE ON UPDATE CASCADE;
