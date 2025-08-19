import { Router } from "express";
import {
  getUserCareerSummaryController,
} from "../controllers/getUserSummaryController";
import { authenticate } from "@/middlewares/authMiddleware";

const router = Router();

// example route: /api/tpqi/summary
// permission: public
router.get("/", (req, res) => {
  res.send("Hello from tpqi career summary routes");
});

// example route: /api/tpqi/summary/user
// permission: protected
// description: Get all career summaries for the authenticated user
router.get("/user", authenticate, getUserCareerSummaryController);

export default router;
