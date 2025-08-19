import { Router } from "express";
import authRoutes from "@Competency/routes/authRoutes";

import searchCompetencyRoutes from "@Competency/routes/searchCompetencyRoutes";
import profileRoutes from "./profileRoutes";

const router = Router();

router.get("/", (req, res) => {
  res.send("Hello from Competency API");
});

router.use("/auth", authRoutes);
router.use("/search", searchCompetencyRoutes);
router.use("/", profileRoutes);

export default router;
