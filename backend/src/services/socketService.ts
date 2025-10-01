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
        await this.emitLatestSentimentData(data.eventName || "total-count-update");
      });

      // Handle disconnect
      socket.on("disconnect", (reason: string) => {
        console.log(`🔌 [SocketService] User disconnected: ${socket.id}, reason: ${reason}`);
      });

      // Send initial data when client connects
      this.emitLatestSentimentData("total-count-update");
    });
  }

  /**
   * Fetch latest sentiment data from database and emit to all connected clients
   */
  public async emitLatestSentimentData(eventName: string = "total-count-update"): Promise<void> {
    try {
      
      // Get comment counts by sentiment - matching API structure
      const commentCounts = await prismaClient.comment.groupBy({
        by: ['sentiment'],
        _count: {
          sentiment: true
        },
        where: {
          sentiment: {
            in: ['Positive', 'Negative', 'Neutral']
          },
          status: 'ANALYZED'
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
            case 'Positive':
              sentimentData.positive = countValue;
              break;
            case 'Negative':
              sentimentData.negative = countValue;
              break;
            case 'Neutral':
              sentimentData.neutral = countValue;
              break;
          }
          sentimentData.total += countValue;
        }
      });

      // Emit to all connected clients
      this.io.emit(eventName, sentimentData);
      this.io.emit("comment-counts-update", sentimentData);

      // console.log({
      //   eventName: "total-count-update",
      //   data: sentimentData,
      //   connectedClients: this.io.engine.clientsCount
      // });

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
      // Get comments from normal users (USER categoryType) - matching API structure
      const userComments = await prismaClient.comment.groupBy({
        by: ['sentiment'],
        where: {
          sentiment: {
            in: ['Positive', 'Negative', 'Neutral']
          },
          status: 'ANALYZED',
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
            case 'Positive':
              sentimentData.positive += countValue;
              break;
            case 'Negative':
              sentimentData.negative += countValue;
              break;
            case 'Neutral':
              sentimentData.neutral += countValue;
              break;
          }
          sentimentData.total += countValue;
        }
      });

      this.io.emit("normal-count-update", sentimentData);
      
      // console.log({
      //   eventName: "normal-count-update",
      //   data: sentimentData,
      //   connectedClients: this.io.engine.clientsCount
      // });

    } catch (error) {
      console.error(`❌ [SocketService] Error in normal sentiment update:`, error);
    }
  }

  /**
   * Emit specific sentiment update for industrialist users
   */
  public async emitIndustrialistSentimentUpdate(): Promise<void> {
    try {
      
      // Get total count of comments from business users - matching API structure
      const totalBusinessComments = await prismaClient.comment.count({
        where: {
          status: 'ANALYZED',
          businessCategory: {
            categoryType: 'BUSINESS'
          }
        }
      });

      // Get comments from business users (BUSINESS categoryType) with sentiment
      const businessComments = await prismaClient.comment.groupBy({
        by: ['sentiment'],
        where: {
          sentiment: {
            in: ['Positive', 'Negative', 'Neutral']
          },
          status: 'ANALYZED',
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
        total: totalBusinessComments
      };

      businessComments.forEach((count) => {
        const sentiment = count.sentiment;
        const countValue = count._count.sentiment;
        
        if (sentiment) {
          switch (sentiment) {
            case 'Positive':
              sentimentData.positive += countValue;
              break;
            case 'Negative':
              sentimentData.negative += countValue;
              break;
            case 'Neutral':
              sentimentData.neutral += countValue;
              break;
          }
        }
      });

      this.io.emit("industrialist-count-update", sentimentData);
      
      // console.log({
      //   eventName: "industrialist-count-update",
      //   data: sentimentData,
      //   connectedClients: this.io.engine.clientsCount
      // });

    } catch (error) {
      console.error(`❌ [SocketService] Error in industrialist sentiment update:`, error instanceof Error ? error.message : String(error));
    }
  }

  /**
   * Emit weighted sentiment analysis data
   */
  public async emitWeightedSentimentUpdate(): Promise<void> {
    try {
      // Get all analyzed comments with their weightage scores - matching API structure
      const comments = await prismaClient.comment.findMany({
        where: { 
          status: 'ANALYZED',
          sentiment: {
            in: ['Positive', 'Negative', 'Neutral']
          }
        },
        select: {
          id: true,
          sentiment: true,
          company: {
            select: {
              businessCategory: {
                select: {
                  weightageScore: true,
                  name: true,
                  categoryType: true
                }
              }
            }
          }
        }
      });

      if (comments.length === 0) {
        const emptyData = {
          totalAnalyzedComments: 0,
          totalWeightedScore: 0,
          weightedPercentages: {
            positive: 0,
            negative: 0,
            neutral: 0
          },
          categoryBreakdown: {
            user: { positive: 0, negative: 0, neutral: 0, totalWeight: 0 },
            business: { positive: 0, negative: 0, neutral: 0, totalWeight: 0 }
          },
          rawWeights: {
            positive: 0,
            negative: 0,
            neutral: 0
          }
        };
        this.io.emit("weighted-total-count-update", emptyData);
        return;
      }

      // Calculate weighted scores for each sentiment
      let positiveWeight = 0;
      let negativeWeight = 0;
      let neutralWeight = 0;
      let totalWeight = 0;

      // Category-wise breakdown
      const userWeights = { positive: 0, negative: 0, neutral: 0, total: 0 };
      const businessWeights = { positive: 0, negative: 0, neutral: 0, total: 0 };

      comments.forEach(comment => {
        const weightageScore = comment.company?.businessCategory?.weightageScore || 1;
        const categoryType = comment.company?.businessCategory?.categoryType;
        
        totalWeight += weightageScore;

        // Calculate overall weighted sentiment
        switch (comment.sentiment) {
          case 'Positive':
            positiveWeight += weightageScore;
            break;
          case 'Negative':
            negativeWeight += weightageScore;
            break;
          case 'Neutral':
            neutralWeight += weightageScore;
            break;
        }

        // Calculate category-wise weighted sentiment
        if (categoryType === 'USER') {
          userWeights.total += weightageScore;
          switch (comment.sentiment) {
            case 'Positive':
              userWeights.positive += weightageScore;
              break;
            case 'Negative':
              userWeights.negative += weightageScore;
              break;
            case 'Neutral':
              userWeights.neutral += weightageScore;
              break;
          }
        } else if (categoryType === 'BUSINESS') {
          businessWeights.total += weightageScore;
          switch (comment.sentiment) {
            case 'Positive':
              businessWeights.positive += weightageScore;
              break;
            case 'Negative':
              businessWeights.negative += weightageScore;
              break;
            case 'Neutral':
              businessWeights.neutral += weightageScore;
              break;
          }
        }
      });

      // Calculate weighted percentages
      const weightedPercentages = {
        positive: totalWeight > 0 ? Math.round((positiveWeight / totalWeight) * 100 * 100) / 100 : 0,
        negative: totalWeight > 0 ? Math.round((negativeWeight / totalWeight) * 100 * 100) / 100 : 0,
        neutral: totalWeight > 0 ? Math.round((neutralWeight / totalWeight) * 100 * 100) / 100 : 0
      };

      // Calculate category-wise percentages
      const categoryBreakdown = {
        user: {
          positive: userWeights.total > 0 ? Math.round((userWeights.positive / userWeights.total) * 100 * 100) / 100 : 0,
          negative: userWeights.total > 0 ? Math.round((userWeights.negative / userWeights.total) * 100 * 100) / 100 : 0,
          neutral: userWeights.total > 0 ? Math.round((userWeights.neutral / userWeights.total) * 100 * 100) / 100 : 0,
          totalWeight: Math.round(userWeights.total * 100) / 100
        },
        business: {
          positive: businessWeights.total > 0 ? Math.round((businessWeights.positive / businessWeights.total) * 100 * 100) / 100 : 0,
          negative: businessWeights.total > 0 ? Math.round((businessWeights.negative / businessWeights.total) * 100 * 100) / 100 : 0,
          neutral: businessWeights.total > 0 ? Math.round((businessWeights.neutral / businessWeights.total) * 100 * 100) / 100 : 0,
          totalWeight: Math.round(businessWeights.total * 100) / 100
        }
      };

      const responseData = {
        totalAnalyzedComments: comments.length,
        totalWeightedScore: Math.round(totalWeight * 100) / 100,
        weightedPercentages,
        categoryBreakdown,
        rawWeights: {
          positive: Math.round(positiveWeight * 100) / 100,
          negative: Math.round(negativeWeight * 100) / 100,
          neutral: Math.round(neutralWeight * 100) / 100
        }
      };

      this.io.emit("weighted-total-count-update", responseData);

      // console.log({
      //   eventName: "weighted-total-count-update",
      //   data: responseData,
      //   connectedClients: this.io.engine.clientsCount
      // });

    } catch (error) {
      console.error(`❌ [SocketService] Error in weighted count update:`, error);
    }
  }

  /**
   * Start periodic sentiment data broadcasting
   */
  public startPeriodicUpdates(intervalMs: number = 15000): void {
    
    setInterval(async () => {
      try {
        // Execute sequentially to avoid race conditions
        await this.emitLatestSentimentData("total-count-update");
        await this.emitNormalSentimentUpdate();
        await this.emitIndustrialistSentimentUpdate();
        await this.emitWeightedSentimentUpdate();
      } catch (error) {
        console.error(`❌ [SocketService] Error in periodic updates:`, error instanceof Error ? error.message : String(error));
      }
    }, intervalMs);
  }
}

export default SocketService;