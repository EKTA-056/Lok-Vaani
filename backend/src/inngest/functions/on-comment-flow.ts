// src/inngest/commentWorkflow.inngest.ts
import { prisma } from "../../db/index";
import ApiResponse from "../../utility/ApiResponse";
import { inngest } from "../client";
import axios from "axios";

// 1. Fetch from Model 1 every 15 seconds and save as RAW
export const commentFetchScheduler = inngest.createFunction(
  { id: "comment-fetch-scheduler" },
  { cron:  "*/1 * * * *"}, // Every 1 minute
  async ({ step }) => {
    let response;
    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
      response = await step.run(`fetch-from-model1-attempt-${attempts + 1}`, async () => {
        return await axios.post(`${process.env.MODEL1_API_URL}/generate`, { timeout: 15000 });
      });

      if (response?.data?.success) {
        break;
      }
      attempts++;
    }

    if (!response?.data?.success) {
      return new ApiResponse(200, "No RAW comments fetched" , "Skipped");
    }

    const data = response.data;

    const newComment = await prisma.comment.create({
      data: {
        postId: data.postId,
        postTitle: data.postTitle,
        companyId: data.companyId,
        businessCategoryId: data.businessCategoryId,
        stakeholderName: data.companyName,
        rawComment: data.comment,
        wordCount: data.wordCount,
        status: "RAW"
      }
    });

    if (!newComment) {
      return new ApiResponse(500, "Failed to save RAW comment" , "Error");
    }

    return new ApiResponse(200, { status: "raw", commentId: newComment.id } , "Comment fetched and saved as RAW");
  }
);

// 2. Process RAW comments: send to Model 2, update DB as ANALYZED
export const processRawComments = inngest.createFunction(
  { id: "process-raw-comments" },
  { cron:  "*/2 * * * *" },
  async ({ step }) => {
    // STEP 1: Find a comment eligible for processing
    const comment = await step.run("find-raw-comment", async () => {
      return await prisma.comment.findFirst({
        where: {
          status: "RAW",
          processingAttempts: { lt: 3 }
        }
      });
    });
    if (!comment) return new ApiResponse(200, "No eligible comments", "Skipped");
    
    // STEP 2: Try sending to Model 2 up to 3 times
    let model2Response;
    let attempts = comment.processingAttempts;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
      model2Response = await step.run(`call-model2-attempt-${attempts + 1}`, async () => {
        return await axios.post(`${process.env.MODEL2_API_URL}/analyze`, {
          comment: comment.rawComment
        }, { timeout: 20000 });
      });

      if (model2Response?.data?.success) {
        break;
      }

      // Increment processingAttempts after each failed attempt
      attempts++;
      await prisma.comment.update({
        where: { id: comment.id },
        data: { processingAttempts: attempts }
      });
    }

    // If all attempts failed, mark as FAILED for manual review
    if (attempts === maxAttempts && !model2Response?.data?.success) {
      const error = model2Response?.data?.error || model2Response?.statusText || "Unknown error";
      await prisma.comment.update({
        where: { id: comment.id },
        data: {
          status: "FAILED",
          processingError: error
        }
      });
      return new ApiResponse(500, "Model 2 processing failed", "Error");
    }

    // If successful, update as ANALYZED
    await prisma.comment.update({
      where: { id: comment.id },
      data: {
        standardComment: model2Response?.data?.translated,
        language: model2Response?.data?.language_type,
        sentiment: model2Response?.data?.sentiment,
        sentimentScore: model2Response?.data?.sentimentScore,
        summary: model2Response?.data?.summary,
        status: "ANALYZED",
        processedAt: new Date(),
        processingError: null
      }
    });

    return new ApiResponse(200, { status: "analyzed", commentId: comment.id }, "Comment processed and updated");
  }
);

// Health check function to monitor system status
export const systemHealthCheck = inngest.createFunction(
  { id: "system-health-check" },
  { cron:  "*/5 * * * *" }, // Every 5 minutes
  async ({ step }) => {
    await step.run("check-system-health", async () => {
      try {
        // Check database connectivity
        await prisma.$queryRaw`SELECT 1`;
        
        // Check recent comment processing
        const recentComments = await prisma.comment.count({
          where: {
            createdAt: {
              gte: new Date(Date.now() - 5 * 60 * 1000) // Last 5 minutes
            }
          }
        });

        // Check processing queue status
        const pendingComments = await prisma.comment.count({
          where: { status: "PROCESSING" }
        });

        const failedComments = await prisma.comment.count({
          where: { status: "FAILED" }
        });

        console.log("💚 System Health Check:", {
          recentComments,
          pendingComments,
          failedComments,
          timestamp: new Date().toISOString()
        });

        // Alert if too many failures or pending items
        if (failedComments > 10 || pendingComments > 20) {
          console.warn("⚠️  System health warning:", {
            failedComments,
            pendingComments
          });
        }

        return {
          healthy: true,
          metrics: { recentComments, pendingComments, failedComments }
        };
      } catch (error: any) {
        console.error("❌ System health check failed:", error.message);
        return { healthy: false, error: error.message };
      }
    });
  }
);