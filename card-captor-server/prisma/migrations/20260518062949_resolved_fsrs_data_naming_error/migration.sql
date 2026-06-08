/*
  Warnings:

  - You are about to drop the column `fsrsDara` on the `Flashcard` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Flashcard" DROP COLUMN "fsrsDara",
ADD COLUMN     "fsrsData" JSONB;
