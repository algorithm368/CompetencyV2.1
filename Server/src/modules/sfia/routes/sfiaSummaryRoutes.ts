import { Router } from "express";
import {
  getUserSummaryController,
} from "../controllers/getUserSummaryController";
import { authenticate } from "@/middlewares/authMiddleware";

const router = Router();

// example route: /api/sfia/summary
// permission: public
router.get("/", (req, res) => {
  res.send("Hello from sfia user summary routes");
});

// example route: /api/sfia/summary/user
// permission: protected
// description: Get all skill summaries for the authenticated user
router.get("/user", authenticate, getUserSummaryController);

export default router;
