/*
  Warnings:

  - You are about to drop the column `owner_id` on the `Class` table. All the data in the column will be lost.
  - Added the required column `owner` to the `Class` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Class" DROP CONSTRAINT "Class_owner_id_fkey";

-- AlterTable
ALTER TABLE "Class" DROP COLUMN "owner_id",
ADD COLUMN     "owner" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_owner_fkey" FOREIGN KEY ("owner") REFERENCES "teachers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
