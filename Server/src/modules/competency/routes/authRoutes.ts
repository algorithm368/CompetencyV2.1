import { Router } from "express";
import { loginWithGoogle, logout, refreshAccessToken, getCurrentUser, checkViewAccess } from "@Competency/controllers/authControllers";
import { authenticate } from "@Middlewares/authMiddleware";

const router = Router();

router.post("/google", loginWithGoogle);
router.post("/logout", logout);
router.post("/refresh-token", refreshAccessToken);
router.get("/me", authenticate, getCurrentUser);
router.get("/check-view", authenticate, checkViewAccess);

export default router;
