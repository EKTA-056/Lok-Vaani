import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { postService, type Post } from '@/services/postService';

interface PostState {
  posts: Post[];
  loading: boolean;
  error: string | null;
}

const initialState: PostState = {
  posts: [],
  loading: false,
  error: null,
};

// Async thunks
export const getPostsAsync = createAsyncThunk(
  'post/getPosts',
  async (_, { rejectWithValue }) => {
    try {
      const posts = await postService.getPost();
      return posts;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch posts';
      return rejectWithValue(errorMessage);
    }
  }
);

const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetPostState: (state) => {
      state.posts = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get posts
      .addCase(getPostsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPostsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
        state.error = null;
      })
      .addCase(getPostsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Get comment counts
      // .addCase(getCommentsCountAsync.pending, (state) => {
      //   state.loading = true;
      //   state.error = null;
      // })
      // .addCase(getCommentsCountAsync.fulfilled, (state, action) => {
      //   state.loading = false;
      //   state.commentCounts = action.payload;
      //   state.error = null;
      // })
      // .addCase(getCommentsCountAsync.rejected, (state, action) => {
      //   state.loading = false;
      //   state.error = action.payload as string;
      // })
      // // Get category comment counts
      // .addCase(getCategoryCommentsCountAsync.pending, (state) => {
      //   state.loading = true;
      //   state.error = null;
      // })
      // .addCase(getCategoryCommentsCountAsync.fulfilled, (state, action) => {
      //   state.loading = false;
      //   state.categoryCommentCounts = action.payload;
      //   state.error = null;
      // })
      // .addCase(getCategoryCommentsCountAsync.rejected, (state, action) => {
      //   state.loading = false;
      //   state.error = action.payload as string;
      // })
      // // Get comments weightage
      // .addCase(getCommentsWeightageAsync.pending, (state) => {
      //   state.loading = true;
      //   state.error = null;
      // })
      // .addCase(getCommentsWeightageAsync.fulfilled, (state, action) => {
      //   state.loading = false;
      //   state.commentsWeightage = action.payload;
      //   state.error = null;
      // })
      // .addCase(getCommentsWeightageAsync.rejected, (state, action) => {
      //   state.loading = false;
      //   state.error = action.payload as string;
      // });
  },
});

export const { clearError, resetPostState } = postSlice.actions;
export default postSlice.reducer;
