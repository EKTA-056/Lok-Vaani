import { Router } from 'express';
import {
  getCommentsByPostId,
  getCommentById,
  getCommentAnalytics
} from '../controller/comment.controller';

const router = Router();

// Get comments by post ID
router.get('/comment-by-post/:postId', getCommentsByPostId);

// Get comment by ID
router.get('/get-comment-by-id/:id', getCommentById);

// Get comment analytics
router.get('/analytics/:postId', getCommentAnalytics);

export default router;