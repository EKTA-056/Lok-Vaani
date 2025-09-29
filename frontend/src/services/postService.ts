import type { Post } from '@/types';
import api from '../utils/baseApi';

export const postService = {
  async getPost(): Promise<Post[]> {
    const response = await api.get("posts/all-posts");
    return response.data.data;
  },
  async getCommentsByPostId(postId: string): Promise<Comment[]> {
    const response = await api.get(`/posts/get-post-byId/${postId}`);
    return response.data.data;
  },
};

// Export types for use in other files
export type {
  Post,
};
