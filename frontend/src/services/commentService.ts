import api from '../utils/baseApi';

// Types for API responses
interface BusinessCategory {
  name: string;
  weightageScore: number;
}

interface Company {
  name: string;
  businessCategory: BusinessCategory;
}

interface Comment {
  id: string;
  company: Company;
  rawComment: string;
  standardComment: string | null;
  summary: string | null;
  sentiment: 'Positive' | 'Negative' | 'Neutral';
  language: string | null;
  keywords: string[];
  status: string;
  createdAt: string;
}

interface CommentCounts {
  total: number;
  positive: number;
  negative: number;
  neutral: number;
}

interface CategoryCounts {
  positive: number;
  negative: number;
  neutral: number;
}

interface CategoryCommentCounts {
  user: CategoryCounts;
  business: CategoryCounts;
}

interface CommentWeightage {
  totalAnalyzedComments: number;
  totalWeightedScore: number;
  weightedPercentages: {
    positive: number;
    negative: number;
    neutral: number;
  };
  categoryBreakdown: {
    user: {
      positive: number;
      negative: number;
      neutral: number;
      totalWeight: number;
    };
    business: {
      positive: number;
      negative: number;
      neutral: number;
      totalWeight: number;
    };
  };
  rawWeights: {
    positive: number;
    negative: number;
    neutral: number;
  };
}

const DEFAULT_POST_ID = '2c10f48b-4ccc-4b9f-a91e-5cb2a97e9965';

export const commentService = {
  async getCommentsByPostId(postId: string = DEFAULT_POST_ID): Promise<Comment[]> {
    const response = await api.get(`/comments/comment-by-post/${postId}`);
    return response.data.data;
  },

  async getCommentsCount(postId: string = DEFAULT_POST_ID): Promise<CommentCounts> {
    const response = await api.get(`/comments/comment-counts/${postId}`);
    return response.data.data;
  },

  async getCategoryCommentsCount(postId: string = DEFAULT_POST_ID): Promise<CategoryCommentCounts> {
    const response = await api.get(`/comments/category-comment-counts/${postId}`);
    return response.data.data;
  },

  async getCommentsWeightage(postId: string = DEFAULT_POST_ID): Promise<CommentWeightage> {
    const response = await api.get(`/comments/comment-weightage/${postId}`);
    return response.data.data;
  },
};

// Export types for use in other files
export type {
  Comment,
  CommentCounts,
  CategoryCommentCounts,
  CategoryCounts,
  Company,
  BusinessCategory,
  CommentWeightage
};
