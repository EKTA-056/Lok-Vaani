import { Router } from 'express';
import {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  uploadPostPdf
} from '../controller/post.controller';
import { upload } from '../middleware/multer';

const router = Router();

router.post('/create-post', upload.single('file'), createPost);

router.get('/all-posts', getAllPosts);

router.get('/get-post-byId/:id', getPostById);

router.put('/update-post/:id', updatePost);

router.delete('/delete-post/:id', deletePost);

router.post('/upload-pdf/:id', uploadPostPdf);

export default router;