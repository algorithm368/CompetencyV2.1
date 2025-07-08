import { Router } from "express";
import authRoutes from "@Competency/routes/authRoutes";
import searchCareerRoutes from "@Competency/routes/searchJobRoutes"


const router = Router();

router.get("/", (req, res) => {
  res.send("Hello from Competency API");
});

router.use("/auth", authRoutes);
router.use("/jobs", searchCareerRoutes);

export default router;
