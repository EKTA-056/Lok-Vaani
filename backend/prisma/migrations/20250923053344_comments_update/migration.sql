/*
  Warnings:

  - You are about to drop the column `processedText` on the `comments` table. All the data in the column will be lost.
  - You are about to drop the column `rawText` on the `comments` table. All the data in the column will be lost.
  - You are about to drop the column `standardText` on the `comments` table. All the data in the column will be lost.
  - You are about to drop the column `tone` on the `comments` table. All the data in the column will be lost.
  - Added the required column `rawComment` to the `comments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `postId` to the `posts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."comments" DROP COLUMN "processedText",
DROP COLUMN "rawText",
DROP COLUMN "standardText",
DROP COLUMN "tone",
ADD COLUMN     "processedComment" TEXT,
ADD COLUMN     "rawComment" TEXT NOT NULL,
ADD COLUMN     "sentimentScore" DOUBLE PRECISION,
ADD COLUMN     "standardComment" TEXT,
ADD COLUMN     "wordCount" INTEGER;

-- AlterTable
ALTER TABLE "public"."posts" ADD COLUMN     "postId" TEXT NOT NULL,
ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "standardTitle" DROP NOT NULL,
ALTER COLUMN "standardDescription" DROP NOT NULL;

-- CreateTable
CREATE TABLE "public"."audit_logs" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "userId" TEXT,
    "entityType" TEXT,
    "entityId" TEXT,
    "details" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "success" BOOLEAN NOT NULL DEFAULT true,
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "audit_logs_action_idx" ON "public"."audit_logs"("action");

-- CreateIndex
CREATE INDEX "audit_logs_category_idx" ON "public"."audit_logs"("category");

-- CreateIndex
CREATE INDEX "audit_logs_userId_idx" ON "public"."audit_logs"("userId");

-- CreateIndex
CREATE INDEX "audit_logs_createdAt_idx" ON "public"."audit_logs"("createdAt");

-- CreateIndex
CREATE INDEX "audit_logs_entityType_entityId_idx" ON "public"."audit_logs"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "audit_logs_success_idx" ON "public"."audit_logs"("success");

-- AddForeignKey
ALTER TABLE "public"."audit_logs" ADD CONSTRAINT "audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
