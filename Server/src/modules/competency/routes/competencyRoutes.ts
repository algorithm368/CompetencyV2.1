import { Router } from "express";
import authRoutes from "@Competency/routes/authRoutes";
import searchCareerRoutes from "@Competency/routes/searchCareerRoutes"


const router = Router();

router.get("/", (req, res) => {
  res.send("Hello from competency");
});

router.use("/auth", authRoutes);
router.use("/careers", searchCareerRoutes);

export default router;
