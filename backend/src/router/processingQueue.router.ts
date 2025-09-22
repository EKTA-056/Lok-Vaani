import { Router } from 'express';
import {
  addToQueue,
  getQueueStatus,
  updateQueueItemStatus,
  retryFailedJob,
  markJobAsFailed
} from '../controller/processingQueue.controller';

const router = Router();

// POST /api/v1/processing-queue - Add item to processing queue
router.post('/', addToQueue);

// GET /api/v1/processing-queue - Get queue status
router.get('/', getQueueStatus);

// PUT /api/v1/processing-queue/:id/status - Update queue item status
router.put('/:id/status', updateQueueItemStatus);

// POST /api/v1/processing-queue/:id/retry - Retry failed job
router.post('/:id/retry', retryFailedJob);

// POST /api/v1/processing-queue/:id/fail - Mark job as failed
router.post('/:id/fail', markJobAsFailed);

export default router;