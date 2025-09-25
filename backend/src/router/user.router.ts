import { Router } from "express";
import { 
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
    getAllUsers,
    changePassword
} from "../controller/user.controller";
import { authenticate } from "../middleware/auth";

const router = Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected routes (require authentication)
router.get("/user-profile", authenticate, getUserProfile);
router.put("/update-profile", authenticate, updateUserProfile);
router.put("/change-password", authenticate, changePassword);

// Admin routes (require admin role)
router.get("/all-users", authenticate, getAllUsers);

// Health check
router.get('/active', (req, res) => {
  res.send('active');
});

export default router;

