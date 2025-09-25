import { Router } from "express";
import {
    getDashboardAnalytics,
    getCommentAnalytics,
    createBusinessCategory,
    updateBusinessCategory,
    deleteBusinessCategory,
    bulkImportBusinessCategories,
    getSystemConfigs,
    updateSystemConfig,
    getProcessingQueueStatus,
    getAuditLogs,
    getAllCategories
} from '../controller/admin.controller';
import { authenticate } from "../middleware/auth";

const router = Router();

// Dashboard and statistics
router.get("/dashboard", authenticate, getDashboardAnalytics);
router.get("/analytics", authenticate, getCommentAnalytics);

// Business Category management
router.post("/business-categories", authenticate, createBusinessCategory);
router.put("/business-categories/:id", authenticate, updateBusinessCategory);
router.delete("/business-categories/:id", authenticate, deleteBusinessCategory);
router.get("/business-categories", authenticate, getAllCategories);
router.post("/business-categories/bulk-import", authenticate, bulkImportBusinessCategories);

// System configuration
router.get("/system-config", authenticate, getSystemConfigs);
router.put("/system-config", authenticate, updateSystemConfig);

// Processing queue monitoring
router.get("/processing-queue", authenticate, getProcessingQueueStatus);

// Audit logs monitoring
router.get("/audit-logs", authenticate, getAuditLogs);

export default router;
