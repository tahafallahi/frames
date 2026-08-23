/*
  Warnings:

  - You are about to drop the column `id` on the `FederatedUser` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id]` on the table `FederatedUser` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_id` to the `FederatedUser` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FederatedUser" DROP COLUMN "id",
ADD COLUMN     "user_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "FederatedUser_user_id_key" ON "FederatedUser"("user_id");

-- AddForeignKey
ALTER TABLE "FederatedUser" ADD CONSTRAINT "FederatedUser_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
