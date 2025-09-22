-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."business_categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "weightageScore" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "categoryType" TEXT NOT NULL DEFAULT 'BUSINESS',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "business_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."posts" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "standardTitle" TEXT NOT NULL,
    "standardDescription" TEXT NOT NULL,
    "postType" TEXT NOT NULL,
    "issuedBy" TEXT NOT NULL,
    "issueDate" TIMESTAMP(3) NOT NULL,
    "deadline" TIMESTAMP(3),
    "language" TEXT NOT NULL,
    "originalPdfUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."comments" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "postTitle" TEXT,
    "companyId" TEXT,
    "businessCategoryId" TEXT NOT NULL,
    "stakeholderName" TEXT NOT NULL,
    "rawText" TEXT NOT NULL,
    "standardText" TEXT,
    "processedText" TEXT,
    "language" TEXT,
    "labeled" TEXT,
    "tone" TEXT,
    "weightageScore" DOUBLE PRECISION,
    "summary" TEXT,
    "keywords" TEXT[],
    "status" TEXT NOT NULL DEFAULT 'RAW',
    "processingError" TEXT,
    "processingAttempts" INTEGER NOT NULL DEFAULT 0,
    "processedAt" TIMESTAMP(3),
    "modelVersion" TEXT,
    "isFlagged" BOOLEAN NOT NULL DEFAULT false,
    "isSpam" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."companies" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "uniNumber" TEXT,
    "state" TEXT,
    "businessCategoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."post_summaries" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "summaryText" TEXT NOT NULL,
    "totalComments" INTEGER NOT NULL DEFAULT 0,
    "positiveCount" INTEGER NOT NULL DEFAULT 0,
    "negativeCount" INTEGER NOT NULL DEFAULT 0,
    "neutralCount" INTEGER NOT NULL DEFAULT 0,
    "weightedScore" DOUBLE PRECISION,
    "topKeywords" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "post_summaries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."processing_queue" (
    "id" TEXT NOT NULL,
    "commentId" TEXT NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 1,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "maxAttempts" INTEGER NOT NULL DEFAULT 3,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "errorLog" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "processing_queue_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "business_categories_name_key" ON "public"."business_categories"("name");

-- CreateIndex
CREATE INDEX "comments_postId_idx" ON "public"."comments"("postId");

-- CreateIndex
CREATE INDEX "comments_status_idx" ON "public"."comments"("status");

-- CreateIndex
CREATE INDEX "comments_createdAt_idx" ON "public"."comments"("createdAt");

-- CreateIndex
CREATE INDEX "comments_businessCategoryId_idx" ON "public"."comments"("businessCategoryId");

-- CreateIndex
CREATE INDEX "comments_companyId_idx" ON "public"."comments"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "companies_name_key" ON "public"."companies"("name");

-- CreateIndex
CREATE INDEX "companies_businessCategoryId_idx" ON "public"."companies"("businessCategoryId");

-- CreateIndex
CREATE INDEX "post_summaries_postId_idx" ON "public"."post_summaries"("postId");

-- CreateIndex
CREATE INDEX "post_summaries_createdAt_idx" ON "public"."post_summaries"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "processing_queue_commentId_key" ON "public"."processing_queue"("commentId");

-- CreateIndex
CREATE INDEX "processing_queue_status_idx" ON "public"."processing_queue"("status");

-- CreateIndex
CREATE INDEX "processing_queue_priority_idx" ON "public"."processing_queue"("priority");

-- AddForeignKey
ALTER TABLE "public"."comments" ADD CONSTRAINT "comments_postId_fkey" FOREIGN KEY ("postId") REFERENCES "public"."posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."comments" ADD CONSTRAINT "comments_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."comments" ADD CONSTRAINT "comments_businessCategoryId_fkey" FOREIGN KEY ("businessCategoryId") REFERENCES "public"."business_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."companies" ADD CONSTRAINT "companies_businessCategoryId_fkey" FOREIGN KEY ("businessCategoryId") REFERENCES "public"."business_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."post_summaries" ADD CONSTRAINT "post_summaries_postId_fkey" FOREIGN KEY ("postId") REFERENCES "public"."posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
