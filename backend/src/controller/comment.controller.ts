import { Request, Response } from 'express';
import { asyncHandler } from '../utility/asyncHandler';
import ApiResponse from '../utility/ApiResponse';
import { ApiError } from '../utility/ApiError';
import { prisma } from '../db/index';
import { logSecurityEvent } from '../utility/auditLogger';

// Get comments by post ID
const getCommentsByPostId = asyncHandler(async (req: Request, res: Response) => {
  const { postId } = req.params;

  if (!postId) {
    throw new ApiError(400, "Post ID is required");
  }

  try {
    const comments = await prisma.comment.findMany({
      where: { postId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        company: {
          select: {
            name: true,
            businessCategory: {
              select: {
                name: true,
                weightageScore: true
              }
            }
          }
        },
        rawComment: true,
        standardComment: true,
        summary: true,
        sentiment: true,
        keywords: true,
        status: true,
        createdAt: true
      }
    });

    res.status(200).json(new ApiResponse(200, comments, "Comments fetched successfully"));
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw new ApiError(500, "Failed to fetch comments");
  }
});

// Get comment analytics
const getCommentAnalytics = asyncHandler(async (req: Request, res: Response) => {
  const { postId } = req.params;

  if (!postId) {
    throw new ApiError(400, "Post ID is required");
  }

  try {
    const analytics = await prisma.comment.groupBy({
      by: ['sentiment'],
      _count: {
        sentiment: true
      },
      where: { postId }
    });

    if (analytics.length === 0) {
      return res.status(200).json(new ApiResponse(200, {}, "No comments found"));
    }

    res.status(200).json(new ApiResponse(200, analytics, "Comment analytics fetched successfully"));
  } catch (error) {
    console.error("Error fetching comment analytics:", error);
    throw new ApiError(500, "Failed to fetch comment analytics");
  }
});

// Get comment by ID
const getCommentById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "Comment ID is required");
  }

  const comment = await prisma.comment.findUnique({
    where: { id },
    select: {
      id: true,
      postId: true,
      company: {
        select: {
          name: true,
          businessCategory: {
            select: {
              name: true,
              weightageScore: true
            }
          }
        }
      },
      rawComment: true,
      standardComment: true,
      summary: true,
      sentiment: true,
      keywords: true,
      status: true,
      createdAt: true
    }
  });

  if (!comment) {
    await logSecurityEvent('COMMENT_FETCH_FAILED', "while fetching comment", { id, reason: 'Comment not found' });
    throw new ApiError(404, "Comment not found");
  }

  res.status(200).json(new ApiResponse(200, comment, "Comment fetched successfully"));  
});

// Get common (repeated) comments by post ID
const getCommonComments = asyncHandler(async (req: Request, res: Response) => {
  const { postId } = req.params;

  if (!postId) {
    throw new ApiError(400, "Post ID is required");
  }

  try {
    const groupedComments = await prisma.comment.groupBy({
      by: ['rawComment'],
      _count: { rawComment: true },
      where: { postId }
    });

    // Only keep comments that are repeated (count > 1)
    const commonComments = groupedComments.filter(c => c._count.rawComment > 1);

    res.status(200).json(new ApiResponse(200, commonComments, "Common comments fetched successfully"));
  } catch (error) {
    console.error("Error fetching common comments:", error);
    throw new ApiError(500, "Failed to fetch common comments");
  }
});

export {
  getCommentsByPostId,
  getCommentAnalytics,
  getCommentById,
  getCommonComments
};