-- AlterTable
ALTER TABLE "Deck" ADD COLUMN     "isCompleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isStudying" BOOLEAN NOT NULL DEFAULT false;
