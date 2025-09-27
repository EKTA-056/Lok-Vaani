import { Server as SocketIOServer } from "socket.io";
import prismaClient from "../prismaClient";
import { Comment, Post, Company, BusinessCategory } from "@prisma/client";

interface SentimentData {
  positive: number;
  negative: number;
  neutral: number;
  total: number;
}

type CommentWithRelations = Comment & {
  post: Post;
  company?: Company | null;
  businessCategory: BusinessCategory;
};

class SocketService {
  private io: SocketIOServer;

  constructor(io: SocketIOServer) {
    this.io = io;
    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    this.io.on("connection", (socket) => {
      console.log(`🔌 [SocketService] User connected: ${socket.id}`);

      // Handle refresh sentiment data request
      socket.on("refresh-sentiment-data", async (data: { eventName?: string }) => {
        await this.emitLatestSentimentData(data.eventName || "sentiment-update");
      });

      // Handle disconnect
      socket.on("disconnect", (reason: string) => {
        console.log(`🔌 [SocketService] User disconnected: ${socket.id}, reason: ${reason}`);
      });

      // Send initial data when client connects
      this.emitLatestSentimentData("sentiment-update");
    });
  }

  /**
   * Fetch latest sentiment data from database and emit to all connected clients
   */
  public async emitLatestSentimentData(eventName: string = "sentiment-update"): Promise<void> {
    try {
      
      // Get comment counts by sentiment
      const commentCounts = await prismaClient.comment.groupBy({
        by: ['sentiment'],
        _count: {
          sentiment: true
        },
        where: {
          sentiment: {
            not: null
          }
        }
      });

      // Calculate totals
      const sentimentData: SentimentData = {
        positive: 0,
        negative: 0,
        neutral: 0,
        total: 0
      };

      commentCounts.forEach((count) => {
        const sentiment = count.sentiment;
        const countValue = count._count.sentiment;
        
        if (sentiment) {
          switch (sentiment) {
            case 'POSITIVE':
              sentimentData.positive = countValue;
              break;
            case 'NEGATIVE':
              sentimentData.negative = countValue;
              break;
            case 'NEUTRAL':
              sentimentData.neutral = countValue;
              break;
          }
          sentimentData.total += countValue;
        }
      });

      // Emit to all connected clients
      this.io.emit(eventName, sentimentData);
      this.io.emit("comment-counts-update", sentimentData);

      return;
    } catch (error) {
      console.error(`❌ [SocketService] Error fetching sentiment data:`, error);
    }
  }

  /**
   * Emit specific sentiment update for normal users
   */
  public async emitNormalSentimentUpdate(): Promise<void> {
    try {
      // Get comments from normal users (USER categoryType)
      const userComments = await prismaClient.comment.groupBy({
        by: ['sentiment'],
        where: {
          sentiment: {
            not: null
          },
          businessCategory: {
            categoryType: 'USER'
          }
        },
        _count: {
          sentiment: true
        }
      });

      const sentimentData: SentimentData = {
        positive: 0,
        negative: 0,
        neutral: 0,
        total: 0
      };

      userComments.forEach((count) => {
        const sentiment = count.sentiment;
        const countValue = count._count.sentiment;
        
        if (sentiment) {
          switch (sentiment) {
            case 'POSITIVE':
              sentimentData.positive = countValue;
              break;
            case 'NEGATIVE':
              sentimentData.negative = countValue;
              break;
            case 'NEUTRAL':
              sentimentData.neutral = countValue;
              break;
          }
          sentimentData.total += countValue;
        }
      });

      this.io.emit("normal-sentiment-update", sentimentData);

    } catch (error) {
      console.error(`❌ [SocketService] Error in normal sentiment update:`, error);
    }
  }

  /**
   * Emit specific sentiment update for industrialist users
   */
  public async emitIndustrialistSentimentUpdate(): Promise<void> {
    try {
      
      // Get comments from business users (BUSINESS categoryType)
      const businessComments = await prismaClient.comment.groupBy({
        by: ['sentiment'],
        where: {
          sentiment: {
            not: null
          },
          businessCategory: {
            categoryType: 'BUSINESS'
          }
        },
        _count: {
          sentiment: true
        }
      });

      const sentimentData: SentimentData = {
        positive: 0,
        negative: 0,
        neutral: 0,
        total: 0
      };

      businessComments.forEach((count) => {
        const sentiment = count.sentiment;
        const countValue = count._count.sentiment;
        
        if (sentiment) {
          switch (sentiment) {
            case 'POSITIVE':
              sentimentData.positive = countValue;
              break;
            case 'NEGATIVE':
              sentimentData.negative = countValue;
              break;
            case 'NEUTRAL':
              sentimentData.neutral = countValue;
              break;
          }
          sentimentData.total += countValue;
        }
      });

      this.io.emit("industrialist-sentiment-update", sentimentData);

    } catch (error) {
      console.error(`❌ [SocketService] Error in industrialist sentiment update:`, error);
    }
  }

  /**
   * Emit weighted sentiment analysis data
   */
  public async emitWeightedSentimentUpdate(): Promise<void> {
    try {
      
      // Get all comments with their associated business categories
      const comments: CommentWithRelations[] = await prismaClient.comment.findMany({
        include: {
          post: true,
          company: true,
          businessCategory: true
        },
        where: {
          sentiment: {
            not: null
          }
        }
      });

      const weightedData = {
        totalAnalyzedComments: comments.length,
        totalWeightedScore: 0,
        weightedPercentages: {
          positive: 0,
          negative: 0,
          neutral: 0
        }
      };

      // Calculate weighted scores based on business category weightage
      comments.forEach((comment: CommentWithRelations) => {
        const weightageScore = comment.businessCategory.weightageScore || 1.0;

        switch (comment.sentiment) {
          case 'POSITIVE':
            weightedData.totalWeightedScore += weightageScore;
            break;
          case 'NEGATIVE':
            weightedData.totalWeightedScore -= weightageScore;
            break;
          case 'NEUTRAL':
            weightedData.totalWeightedScore += (weightageScore * 0.3);
            break;
        }
      });

      // Calculate percentages (simplified for socket emission)
      if (weightedData.totalAnalyzedComments > 0) {
        const positiveComments = comments.filter((c: CommentWithRelations) => c.sentiment === 'POSITIVE').length;
        const negativeComments = comments.filter((c: CommentWithRelations) => c.sentiment === 'NEGATIVE').length;
        const neutralComments = comments.filter((c: CommentWithRelations) => c.sentiment === 'NEUTRAL').length;

        weightedData.weightedPercentages.positive = parseFloat(((positiveComments / weightedData.totalAnalyzedComments) * 100).toFixed(2));
        weightedData.weightedPercentages.negative = parseFloat(((negativeComments / weightedData.totalAnalyzedComments) * 100).toFixed(2));
        weightedData.weightedPercentages.neutral = parseFloat(((neutralComments / weightedData.totalAnalyzedComments) * 100).toFixed(2));
      }

      this.io.emit("weighted-sentiment-update", weightedData);

    } catch (error) {
      console.error(`❌ [SocketService] Error in weighted sentiment update:`, error);
    }
  }

  /**
   * Start periodic sentiment data broadcasting
   */
  public startPeriodicUpdates(intervalMs: number = 30000): void {
    
    setInterval(async () => {
      await Promise.all([
        this.emitLatestSentimentData("sentiment-update"),
        this.emitNormalSentimentUpdate(),
        this.emitIndustrialistSentimentUpdate(),
        this.emitWeightedSentimentUpdate()
      ]);
    }, intervalMs);
  }
}

export default SocketService;