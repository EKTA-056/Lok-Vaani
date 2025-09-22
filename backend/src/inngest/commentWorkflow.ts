// src/inngest/commentWorkflow.inngest.ts
import { prisma } from "../db/index";
import { inngest } from "./inngestClient";

// Types for the workflow
interface CommentData {
  companyId: string;
  postTitle?: string;
}

interface WorkflowEvent {
  data: {
    postId: string;
    commentData: CommentData;
  };
}

interface SummarizationEvent {
  data: {
    postId: string;
  };
}

// AI Model Functions (implement these with your actual AI models)
async function generateAndTranslateComment(commentData: CommentData, companyName: string) {
  // TODO: Replace with your actual Model 1 logic
  return {
    rawText: `Generated comment about ${commentData.postTitle || 'the proposal'} from ${companyName}`,
    translatedText: `Translated comment about ${commentData.postTitle || 'the proposal'} from ${companyName}`,
    detectedLanguage: "en"
  };
}

async function analyzeSentiment(text: string) {
  // TODO: Replace with your actual Model 2 logic
  const sentiments = ["POSITIVE", "NEGATIVE", "NEUTRAL"] as const;
  const randomSentiment = sentiments[Math.floor(Math.random() * sentiments.length)];
  
  return {
    label: randomSentiment,
    score: Math.random(),
    tone: "SUPPORTIVE",
    weightageScore: 1.0 + Math.random() * 0.5,
    keywords: ["regulation", "compliance", "business"]
  };
}

async function generatePostSummary(comments: any[]) {
  // TODO: Replace with your actual Model 3 logic
  return {
    summary: `Analysis of ${comments.length} comments shows mixed sentiment regarding the proposed regulations.`,
    overallScore: 0.5 + Math.random() * 0.5,
    topKeywords: ["regulation", "compliance", "business", "impact"]
  };
}

export const commentWorkflow = inngest.createFunction(
  { id: "comment-analysis-workflow" },
  { event: "app/comment.generated" },
  async ({ event, step }: any) => {
    const { postId, commentData } = event.data;

    // STEP 1: Model 1 - Generate + Translate Comment
    const translatedComment = await step.run("model1-generate-translate", async () => {
      // First, fetch company details
      const company = await prisma.company.findUnique({
        where: { id: commentData.companyId },
        include: { businessCategory: true }
      });

      if (!company) {
        throw new Error(`Company not found: ${commentData.companyId}`);
      }

      // Call your Model 1 (comment generation + translation)
      const result = await generateAndTranslateComment(commentData, company.name);
      
      // Save to database immediately
      const comment = await prisma.comment.create({
        data: {
          postId: postId,
          postTitle: commentData.postTitle || null,
          companyId: commentData.companyId,
          businessCategoryId: company.businessCategoryId,
          stakeholderName: company.name,
          rawText: result.rawText,
          processedText: result.translatedText,
          language: result.detectedLanguage,
          status: "PROCESSING"
        }
      });
      
      return { commentId: comment.id, processedText: result.translatedText };
    });

    // STEP 2: Model 2 - Sentiment Analysis
    const sentimentResult = await step.run("model2-sentiment-analysis", async () => {
      // Call your Model 2 (sentiment analysis)
      const sentiment = await analyzeSentiment(translatedComment.processedText);
      
      // Update database with sentiment results
      await prisma.comment.update({
        where: { id: translatedComment.commentId },
        data: {
          labeled: sentiment.label, // 'POSITIVE', 'NEGATIVE', 'NEUTRAL'
          tone: sentiment.tone,
          weightageScore: sentiment.weightageScore,
          keywords: sentiment.keywords,
          status: "ANALYZED"
        }
      });
      
      return { commentId: translatedComment.commentId, sentiment: sentiment.label };
    });

    // STEP 3: Check if we should run Model 3 (Summarization)
    await step.run("trigger-summarization", async () => {
      // Count analyzed comments for this post
      const analyzedCount = await prisma.comment.count({
        where: { 
          postId: postId, 
          status: "ANALYZED" 
        }
      });

      // Trigger summarization if we have enough comments (e.g., every 10 comments)
      if (analyzedCount % 10 === 0) {
        await inngest.send({
          name: "app/post.summarize",
          data: { postId: postId }
        });
      }
    });

    // STEP 4: Real-time notification
    await step.run("notify-frontend", async () => {
      // Emit Socket.IO event for real-time update
      if (global.io) {
        global.io.emit("commentAnalyzed", {
          postId: postId,
          commentId: sentimentResult.commentId,
          sentiment: sentimentResult.sentiment
        });
      }
      console.log(`✅ Comment analyzed: ${sentimentResult.commentId}`);
    });

    return { 
      status: "completed", 
      commentId: sentimentResult.commentId 
    };
  }
);

// Separate function for Model 3 (Summarization)
export const postSummarization = inngest.createFunction(
  { id: "post-summarization" },
  { event: "app/post.summarize" },
  async ({ event, step }) => {
    const { postId } = event.data;

    await step.run("model3-summarization", async () => {
      // Get all analyzed comments for this post
      const comments = await prisma.comment.findMany({
        where: { 
          postId: postId, 
          status: "ANALYZED" 
        },
        select: {
          processedText: true,
          labeled: true,
          weightageScore: true
        }
      });

      // Call your Model 3 (summarization)
      const summaryResult = await generatePostSummary(comments);

      // Save summary to PostSummary table
      await prisma.postSummary.create({
        data: {
          postId: postId,
          summaryText: summaryResult.summary,
          totalComments: comments.length,
          positiveCount: comments.filter(c => c.labeled === 'POSITIVE').length,
          negativeCount: comments.filter(c => c.labeled === 'NEGATIVE').length,
          neutralCount: comments.filter(c => c.labeled === 'NEUTRAL').length,
          weightedScore: summaryResult.overallScore,
          topKeywords: summaryResult.topKeywords
        }
      });

      // Real-time notification for summary update
      if (global.io) {
        global.io.emit("summaryUpdated", {
          postId: postId,
          summary: summaryResult.summary,
          totalComments: comments.length
        });
      }
      console.log(`✅ Summary created for post ${postId} with ${comments.length} comments`);
    });

    return { status: "summary-completed" };
  }
);