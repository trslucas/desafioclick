/*
  Warnings:

  - Added the required column `capacity` to the `Class` table without a default value. This is not possible if the table is not empty.
  - Added the required column `class_number` to the `Class` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isAvaiable` to the `Class` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Class" ADD COLUMN     "capacity" INTEGER NOT NULL,
ADD COLUMN     "class_number" INTEGER NOT NULL,
ADD COLUMN     "isAvaiable" BOOLEAN NOT NULL;
