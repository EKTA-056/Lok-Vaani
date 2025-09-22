import { Router } from 'express';
import {
  addComment,
  getCommentsByPostId,
  getCommentById,
  getCommentAnalytics
} from '../controller/comment.controller';

const router = Router();

// POST /api/v1/comments - Add new comment
router.post('/add-comment', addComment);

// GET /api/v1/comments/post/:postId - Get comments by post ID
router.get('/comment-by-post/:postId', getCommentsByPostId);

// GET /api/v1/comments/:id - Get comment by ID
router.get('/get-comment-by-id/:id', getCommentById);

// GET /api/v1/comments/analytics/:postId - Get comment analytics
router.get('/analytics/:postId', getCommentAnalytics);

export default router;