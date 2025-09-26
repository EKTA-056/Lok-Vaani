/*
  Warnings:

  - You are about to drop the column `labeled` on the `comments` table. All the data in the column will be lost.
  - You are about to drop the column `processedComment` on the `comments` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."comments" DROP COLUMN "labeled",
DROP COLUMN "processedComment",
ADD COLUMN     "sentiment" TEXT;
