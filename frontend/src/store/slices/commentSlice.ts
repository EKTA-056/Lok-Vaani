import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { commentService, type Comment, type CommentCounts, type CategoryCommentCounts, type CommentWeightage } from '../../services/commentService';

interface CommentState {
  comments: Comment[];
  commentCounts: CommentCounts | null;
  categoryCommentCounts: CategoryCommentCounts | null;
  commentsWeightage: CommentWeightage | null;
  loading: boolean;
  error: string | null;
}

const initialState: CommentState = {
  comments: [],
  commentCounts: null,
  categoryCommentCounts: null,
  commentsWeightage: null,
  loading: false,
  error: null,
};

// Async thunks
export const getCommentsByPostIdAsync = createAsyncThunk(
  'comment/getCommentsByPostId',
  async (postId: string, { rejectWithValue }) => {
    try {
      const comments = await commentService.getCommentsByPostId(postId);
      return comments;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch comments';
      return rejectWithValue(errorMessage);
    }
  }
);

export const getCommentsCountAsync = createAsyncThunk(
  'comment/getCommentsCount',
  async (postId: string, { rejectWithValue }) => {
    try {
      const counts = await commentService.getCommentsCount(postId);
      // console.log('✅ [CommentSlice] Comment counts fetched successfully:', counts);
      return counts;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch comment counts';
      return rejectWithValue(errorMessage);
    }
  }
);

export const getCategoryCommentsCountAsync = createAsyncThunk(
  'comment/getCategoryCommentsCount',
  async (postId: string, { rejectWithValue }) => {
    try {
      const categoryCounts = await commentService.getCategoryCommentsCount(postId);
      // console.log('✅ [CommentSlice] Category comment counts fetched successfully:', categoryCounts);
      return categoryCounts;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch category comment counts';
      return rejectWithValue(errorMessage);
    }
  }
);

export const getCommentsWeightageAsync = createAsyncThunk(
  'comment/getCommentsWeightage',
  async (postId: string, { rejectWithValue }) => {
    try {
      const weightage = await commentService.getCommentsWeightage(postId);
      // console.log('✅ [CommentSlice] Comments weightage fetched successfully:', {
      //   totalAnalyzedComments: weightage.totalAnalyzedComments,
      //   totalWeightedScore: weightage.totalWeightedScore,
      //   weightedPercentages: weightage.weightedPercentages,
      //   categoryBreakdown: weightage.categoryBreakdown
      // });
      return weightage;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch comments weightage';
      return rejectWithValue(errorMessage);
    }
  }
);

const commentSlice = createSlice({
  name: 'comment',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetCommentState: (state) => {
      state.comments = [];
      state.commentCounts = null;
      state.categoryCommentCounts = null;
      state.commentsWeightage = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get comments by post ID
      .addCase(getCommentsByPostIdAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCommentsByPostIdAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = action.payload;
        state.error = null;
      })
      .addCase(getCommentsByPostIdAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Get comment counts
      .addCase(getCommentsCountAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCommentsCountAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.commentCounts = action.payload;
        state.error = null;
      })
      .addCase(getCommentsCountAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Get category comment counts
      .addCase(getCategoryCommentsCountAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCategoryCommentsCountAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.categoryCommentCounts = action.payload;
        state.error = null;
      })
      .addCase(getCategoryCommentsCountAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Get comments weightage
      .addCase(getCommentsWeightageAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCommentsWeightageAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.commentsWeightage = action.payload;
        state.error = null;
      })
      .addCase(getCommentsWeightageAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, resetCommentState } = commentSlice.actions;
export default commentSlice.reducer;
